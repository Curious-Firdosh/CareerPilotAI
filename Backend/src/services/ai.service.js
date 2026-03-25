import { GoogleGenAI } from "@google/genai";
import { ENV } from "../utils/ENV.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema"

const genai = new GoogleGenAI({
    apiKey: ENV.API_KEY
})


// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })





export const GenerateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {

    const Prompt = `
                    You are an AI that MUST return ONLY valid JSON.
                    
                    FIELD EXPLANATION (FOLLOW STRICTLY):

                    1. matchScore:
                    - Must be a number between 0 and 100
                    - Represents how well the candidate matches the job description
                    - Higher = better match

                    2. technicalQuestions:
                    - Must be an array of objects (NOT strings)
                    - Each object must contain:
                    - question: A real technical interview question based on candidate's skills and job description
                    - intention: Why the interviewer is asking this question (what they want to evaluate)
                    - answer: A structured approach explaining how the candidate should answer (not just final answer)

                    3. behavioralQuestions:
                    - Must be an array of objects (NOT strings)
                    - Each object must contain:
                    - question: Behavioral or situational question
                    - intention: What soft skill or behavior is being tested
                    - answer: Suggested answering strategy (use structured thinking like STAR method)

                    4. skillGaps:
                    - Must be an array of objects
                    - Each object must contain:
                    - skill: A missing or weak skill relevant to the job
                    - severity: MUST be one of ["low", "medium", "high"]
                    - Do NOT use any other values

                    5. preparationPlan:
                    - Must be an array of objects (NOT strings)
                    - Each object represents ONE day
                    - Each object must contain:
                    - day: number starting from 1
                    - focus: main topic for that day
                    - tasks: array of actionable tasks (NOT paragraph, must be list of strings)

                    6. title:
                    - Must be a string
                    - Should be the job role name from the job description

                    IMPORTANT RULES:
                    -Every array must contain OBJECTS, not key-value strings
                    - Do NOT flatten objects into arrays
                    - Do NOT skip any field
                    - Do NOT add extra fields
                    - Ensure valid JSON format
                    -If any rule is violated, the response is INVALID.


                    EXAMPLE OUTPUT (FOLLOW EXACTLY):

                    {
                    "matchScore": 90,
                    "technicalQuestions": [
                        {
                        "question": "Q1",
                        "intention": "I1",
                        "answer": "A1"
                        }
                    ],
                    "behavioralQuestions": [
                        {
                        "question": "Q1",
                        "intention": "I1",
                        "answer": "A1"
                        }
                    ],
                    "skillGaps": [
                        {
                        "skill": "Testing",
                        "severity": "high"
                        }
                    ],
                    "preparationPlan": [
                        {
                        "day": 1,
                        "focus": "Backend Security",
                        "tasks": [
                            "Learn JWT authentication and implement it in a Node.js app",
                            "Build a middleware for role-based access control (RBAC)",
                            "Read about OAuth 2.0 basics",
                            "Practice securing REST APIs using Express"
                        ]
                        },
                        {
                        "day": 2,
                        "focus": "Frontend Optimization",
                        "tasks": [
                            "Revise React hooks (useMemo, useCallback)",
                            "Optimize a React app for performance",
                            "Learn Next.js SSR and SSG concepts",
                            "Implement code splitting in a sample project"
                        ]
                        }
                    ],
                    "title": "Full Stack Developer"
                    }

                 Generate interview report for:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
        `;



    const response = await genai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: Prompt,
        config: {
            responseMimeType: "application/json",

        }
    })

    const parsed = JSON.parse(response.text);


}

