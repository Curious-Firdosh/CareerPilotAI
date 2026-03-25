import { PDFParse } from "pdf-parse";
import { GenerateInterviewReport } from "../services/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";


/**
 * @route  POST   api/interview/
 * @description --> Generate interview report based on candidate's resume, self description and job description 
 * @access  private
 */

export const generateInterviewReport = async (req, res) => {

    try {

        const resumeFile = req.file; // Access the uploaded resume file
        const resumeContent = await new PDFParse(resumeFile.buffer); // Parse the PDF content


        const { selfDescription, jobDescription } = req.body; // Access self description and job description from the request body

        // Now you can use resumeContent, selfDescription, and jobDescription to generate the interview report using your AI service

        const interviewReportByAi = await GenerateInterviewReport(
            {
                resume: resumeContent.text,
                selfDescription,
                jobDescription
            });

        
            console.log(interviewReportByAi);
            
        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            interviewReportByAi
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