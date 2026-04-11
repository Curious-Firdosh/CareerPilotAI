import { PDFParse } from "pdf-parse";
import { GenerateHtmlContent, GenerateInterviewReport } from "../services/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";
import User from "../models/user.js";
import mongoose from "mongoose";




/**
 * @route  POST   api/interview/
 * @description --> Generate interview report based on candidate's resume, self description and job description 
 * @access  private
 */

export const generateInterviewReport = async (req, res) => {
    let session;
    let creditsDeducted = false;

    try {
        const resume = req.file;

        if (!resume) {
            return res.status(400).json({
                code: "FILE_REQUIRED",
                message: "Resume file is required"
            });
        }

        if (resume.size > 2 * 1024 * 1024) {
            return res.status(400).json({
                code: "FILE_TOO_LARGE",
                message: "File too large (max 2MB)"
            });
        }


        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                code: "MISSING_FIELDS",
                message: "Missing required fields"
            });
        }



        // 🔥 2. TRANSACTION → Deduct credits (FAST ONLY)
        session = await mongoose.startSession();
        session.startTransaction();


        const user = await User.findOne({
            _id: req.user.id
        }).session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "User not found"
            });
        }

        if (user.isGeneratingReport) {
            await session.abortTransaction();
            return res.status(400).json({
                code: "ALREADY_GENERATING",
                message: "Report is already being generated. Please wait."
            });
        }

        if (user.credits < 5) {
            await session.abortTransaction();
            return res.status(400).json({
                code: "INSUFFICIENT_CREDITS",
                message: "You don’t have enough credits."
            });
        }

        user.credits -= 5;
        user.isGeneratingReport = true;

        await user.save({ session });

        creditsDeducted = true;

        await session.commitTransaction();
        session.endSession();

        // 🔒 3. HEAVY WORK (NO TRANSACTION)
        const uint8Array = new Uint8Array(resume.buffer);
        const parser = new PDFParse({ data: uint8Array });
        const resumeContent = await parser.getText();

        const interviewReportByAi = await Promise.race([
            GenerateInterviewReport({
                resume: resumeContent,
                selfDescription,
                jobDescription
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("AI timeout")), 40000)
            )
        ]);

        // 🔥 4. TRANSACTION → Save report
        session = await mongoose.startSession();
        session.startTransaction();

        const interviewReport = await InterviewReportModel.create([{
            user: req.user.id,
            resumeText: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        }], { session });

         await User.findByIdAndUpdate(
            req.user.id,
            { $set: { isGeneratingReport: false } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        

        return res.status(201).json({
            code: "SUCCESS",
            message: "Interview Report Generated Successfully",
            interviewReport: interviewReport[0]
        });

    } catch (err) {
        console.error("Error generating interview report:", err.message);

        // 🔥 Detect AI error
        const aiCode = err?.error?.code || err?.response?.status;
        const aiMessage = err?.error?.message || err?.message || "";


        if (creditsDeducted) {
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { credits: 5 },
                $set: { isGeneratingReport: false },
                $push: {
                    usageHistory: {
                        type: "Refund - Resume Analysis",
                        creditsUsed: -5
                    }
                }
            });
        }

        if (
            aiCode === 503 ||
            aiMessage.toLowerCase().includes("timeout") ||
            aiMessage.toLowerCase().includes("overloaded") ||
            aiMessage.toLowerCase().includes("high demand")
        ) {
            return res.status(503).json({
                code: "AI_BUSY",
                message: "AI is under high load. Please try again."
            });
        }

        return res.status(500).json({
            code: "REPORT_GENERATION_FAILED",
            message: "Failed to generate interview report"
        });

    } finally {
        if (session) session.endSession();
    }
};
/**
 * @description controller to generate interview report in pdf format based on candidate's resume, self description and job description
 * @route POST api/interview/pdf
 * @access private
 */

export const GenerateResumePdfController = async (req, res) => {

    const session = await mongoose.startSession();

    try {
        const { id } = req.params;

        // 1. Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        // 2. Fetch report
        const interviewReport = await InterviewReportModel.findById({
            _id: id,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const { resumeText, selfDescription, jobDescription } = interviewReport;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({
                message: "Invalid report data"
            });
        }

        // =========================
        // 🔒 TRANSACTION START
        // =========================
        await session.startTransaction();

        const user = await User.findOne({
            _id: req.user.id
        }).session(session);

        if (user.isGeneratingPdf) {
            await session.abortTransaction();
            return res.status(400).json({
                code: "ALREADY_GENERATING",
                message: "PDF is already being generated. Please wait."
            });
        }

        if (user.credits < 5) {
            await session.abortTransaction();
            return res.status(400).json({
                code: "INSUFFICIENT_CREDITS",
                message: "You don’t have enough credits."
            });
        }

        // Lock + deduct
        user.credits -= 5;
        user.isGeneratingPdf = true;
        user.usageHistory.push({
            type: "PDF Generation",
            creditsUsed: 5
        });

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        // =========================
        // 🚀 OUTSIDE TRANSACTION
        // =========================

        let pdfBuffer;

        try {
            pdfBuffer = await GenerateHtmlContent({
                resume: resumeText,
                selfDescription,
                jobDescription
            });

            if (!pdfBuffer) {
                throw new Error("PDF generation failed");
            }

            // unlock
            await User.findByIdAndUpdate(req.user.id, {
                $set: { isGeneratingPdf: false }
            });

        } catch (err) {
            // refund
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { credits: 5 },
                $set: { isGeneratingPdf: false },
                $push: {
                    usageHistory: {
                        type: "PDF Refund",
                        creditsUsed: -5
                    }
                }
            });

            // 🔥 Proper AI error detection
            const aiCode = err?.error?.code || err?.response?.status;
            const aiMessage = err?.error?.message || err?.message || "";

            if (
                aiCode === 503 ||
                aiMessage.toLowerCase().includes("overloaded") ||
                aiMessage.toLowerCase().includes("high demand")
            ) {
                return res.status(503).json({
                    code: "AI_BUSY",
                    message: "AI is under high load. Please try again in a few seconds."
                });
            }

            return res.status(500).json({
                code: "PDF_GENERATION_FAILED",
                message: "Failed to generate PDF"
            });
        }

        // =========================
        // 📤 RESPONSE
        // =========================

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${id}.pdf`
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF Generation Error:", error);

        return res.status(500).json({
            code: "SERVER_ERROR",
            message: "Something went wrong while generating PDF"
        });
    }
};

/**
 * @description controller to get all interview reports of the logged in user
 * @route GET api/interview/
 * @access private
 */

export const getAllInterviewReports = async (req, res) => {

    try {

        const userId = req.user.id; // Assuming you have user authentication and the user ID is available in req.user.id

        if (userId === undefined) {
            return res.status(400).json({ error: "User ID is required to fetch interview reports" });
        }

        const interviewReports = await InterviewReportModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .select("user matchScore title createdAt")
            .limit(3);

        return res.status(200).json({
            message: "All interview reports retrieved successfully",
            interviewReports
        });
    } catch (err) {
        console.error("Error fetching interview reports:", err);
        res.status(500).json({ error: "Failed to fetch interview reports" });
    }
};


/**
 * @description controller to get a specific interview report by its ID
 * @route GET api/interview/:id
 * @access private
 */

export const getInterviewReportById = async (req, res) => {

    try {
        const reportId = req.params.id;
        const userId = req.user.id;

        const InterviewReport = await InterviewReportModel.findOne({ _id: reportId, user: userId })

        return res.status(200).json({
            message: "Interview report retrieved successfully",
            InterviewReport
        })
    } catch (err) {
        console.error("Error fetching interview report by ID:", err);
        res.status(500).json({ error: "Failed to fetch interview report by ID" });
    }
}


