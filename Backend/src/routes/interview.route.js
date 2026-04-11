import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { generateInterviewReport, GenerateResumePdfController, getAllInterviewReports, getInterviewReportById } from "../controllers/interview.controller.js";
import { upload } from "../middleware/file.middileware.js";
import { aiLimiter } from "../middleware/rateLimite.js";

export const interviewRouter = Router()


/**
 * @route  POST api/interview/
 * @description --> Generate interview report based on candidate's resume, self description and job description 
 * @access  private
 */

interviewRouter.post("/" , authUser , aiLimiter , upload.single("resume"), generateInterviewReport )

/**
 * @description controller to generate interview report in pdf format based on candidate's resume, self description and job description
 * @route  GET api/interview/pdf/:id
 * @access  private
 */

interviewRouter.post('/pdf/:id' , authUser ,aiLimiter, GenerateResumePdfController )

/**
 * @route  GET api/interview/
 * @description --> Get all interview reports of the user
 * @access  private
 */

interviewRouter.get("/" , authUser , getAllInterviewReports )


/**
 * @route  GET api/interview/:reportId
 * @description --> Get a specific interview report by its ID
 * @access  private
 */

interviewRouter.get('/report/:id' , authUser , getInterviewReportById)