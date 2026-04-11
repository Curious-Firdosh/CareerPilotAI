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

    try {
        const resume = req.file;

        // 🔒 1. Validation
        if (!resume) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        if (resume.size > 2 * 1024 * 1024) {
            return res.status(400).json({ message: "File too large (max 2MB)" });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 🔥 2. TRANSACTION → Deduct credits (FAST ONLY)
        session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findOneAndUpdate(
            {
                _id: req.user.id,
                credits: { $gte: 5 }
            },
            {
                $inc: { credits: -5 },
                $push: {
                    usageHistory: {
                        type: "Resume Analysis",
                        creditsUsed: 5
                    }
                }
            },
            {returnDocument :"after", session }
        );

        if (!user) {
            await session.abortTransaction();
            session.endSession();

            return res.status(403).json({ message: "Not enough credits" });
        }

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

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Interview Report Generated Successfully",
            interviewReport: interviewReport[0]
        });

    } catch (err) {
        console.error("Error generating interview report:", err.message);

        // 🔁 Refund (safe fallback)
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { credits: 5 },
            $push: {
                usageHistory: {
                    type: "Refund - Resume Analysis",
                    creditsUsed: -5
                }
            }
        });

        return res.status(500).json({
            error: err.message || "Failed to generate interview report"
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
    try {
        const { id } = req.params;

        // 🔒 1. Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        // 🔒 2. Fetch report
        const interviewReport = await InterviewReportModel.findOne({
            _id: id,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const { resumeText, selfDescription, jobDescription } = interviewReport;

        // 🔒 3. Validate data
        if (!resumeText || !jobDescription) {
            return res.status(400).json({
                message: "Invalid report data"
            });
        }

        const user = await User.findOneAndUpdate(
            {
                _id: req.user.id,
                isGeneratingPdf: false,
                credits: { $gte: 5 }
            },
            {
                $inc: { credits: -5 },
                $set: { isGeneratingPdf: true },
                $push: {
                    usageHistory: {
                        type: "PDF Generation",
                        creditsUsed: 5
                    }
                },

            },
            { returnDocument: 'after' }
        )

        if (!user) {
            return res.status(400).json({
                message: "Either already generating or insufficient credits"
            });
        }

        try {
            console.log("Generating PDF...");

            // 🔒 7. Generate PDF
            const pdfBuffer = await GenerateHtmlContent({
                resume: resumeText,
                selfDescription,
                jobDescription
            });

            if (!pdfBuffer) {
                throw new Error("PDF generation failed");
            }

            //! If this fails: -- issue that you have to solveee
            await User.findByIdAndUpdate(req.user.id,
                {
                    $set: { isGeneratingPdf: false }
                }
            )

            console.log("PDF generated successfully");

            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=resume_${id}.pdf`
            });

            return res.send(pdfBuffer);

        } catch (err) {
            // 🔁 9. Refund + unlock

            await User.findByIdAndUpdate(user._id,
                {
                    $inc: { credits: 5 },
                    $set: { isGeneratingPdf: false },
                    $push: {
                        usageHistory: {
                            type: "PDF Refund",
                            creditsUsed: -5
                        }
                    }
                },
            );

            throw err
        }


    } catch (error) {
        console.error("PDF Generation Error:", error);

        if (
            error?.error?.code === 503 ||
            error?.error?.message?.includes("high demand")
        ) {
            return res.status(503).json({
                message: "Server is busy. Please try again in a few seconds."
            });
        }

        return res.status(500).json({
            message: "Something went wrong while generating PDF."
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


