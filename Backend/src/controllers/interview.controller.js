import { PDFParse } from "pdf-parse";
import { GenerateHtmlContent, GenerateInterviewReport } from "../services/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";
import { ca } from "zod/v4/locales";


/**
 * @route  POST   api/interview/
 * @description --> Generate interview report based on candidate's resume, self description and job description 
 * @access  private
 */

export const generateInterviewReport = async (req, res) => {

    try {

        const resume = req.file; // Access the uploaded resume file

        const uint8Array = new Uint8Array(resume.buffer);

        const parser = new PDFParse({ data: uint8Array });

        const resumeContent = await parser.getText();


        const { selfDescription, jobDescription } = req.body; // Access self description and job description from the request body

        // Now you can use resumeContent, selfDescription, and jobDescription to generate the interview report using your AI service

        const interviewReportByAi = await GenerateInterviewReport(
            {
                resume: resumeContent,
                selfDescription,
                jobDescription
            });



        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resumeText: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })


        return res.status(201).json({
            message: " Interview Report Generated Successfully",
            interviewReport
        })



    }
    catch (err) {
        console.error("Error generating interview report:", err);
        res.status(500).json({ error: "Failed to generate interview report" });
    }
}


/**
 * @description controller to generate interview report in pdf format based on candidate's resume, self description and job description
 * @route POST api/interview/pdf
 * @access private
 */

export const GenerateResumePdfController = async (req , res) => {

    try{

        const {id} = req.params;

        console.log(id);
        

        const interviewReport = await InterviewReportModel.findOne({ _id: id});
        
        if(!interviewReport){
            return res.status(404).json({
                message : "Interview report not found for the given ID and user."
            })
        }

        const {resumeText , selfDescription , jobDescription} = interviewReport

        console.log('Generetinggggg........');
        const pdfBuffer = await GenerateHtmlContent({resume :resumeText , selfDescription , jobDescription})
        console.log('hurrey........ Pdf generated successfully');

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${id}.pdf`
        })

        
        
        res.send(pdfBuffer);
    }
    catch(err){
        console.error("Error generating interview report PDF:", err);
        res.status(500).json({ error: "Failed to generate interview report PDF" });
    }
}

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


