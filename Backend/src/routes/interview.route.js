import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { generateInterviewReport } from "../controllers/interview.controller.js";
import { upload } from "../middleware/file.middileware.js";

export const interviewRouter = Router()


/**
 * @route  POST api/interview/
 * @description --> Generate interview report based on candidate's resume, self description and job description 
 * @access  private
 */

interviewRouter.post("/" , authUser , upload.single("resume"), generateInterviewReport )