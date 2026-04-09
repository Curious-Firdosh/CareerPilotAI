import { GoogleGenAI } from "@google/genai";
import { ENV } from "../utils/ENV.js";
import puppeteer from 'puppeteer';


const genai = new GoogleGenAI({
    apiKey: ENV.API_KEY
})

// 1. Keep the browser instance stored outside the function
let browserInstance = null;

// 2. Create a helper to get or launch the browser
export const getBrowser = async () => {
    if (!browserInstance || !browserInstance.isConnected()) {
        console.log("Launching fresh Puppeteer browser...");

        browserInstance = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage" // CRITICAL: Stops memory crashes
            ],
        });

        // Self-Healing: Reset if it crashes in the background
        browserInstance.on('disconnected', () => {
            console.error("Puppeteer crashed! Resetting...");
            browserInstance = null;
        });
    }
    return browserInstance;
};



export const GenerateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {


    //*gemini-3-flash-preview
    const Prompt = `

    You are an expert career coach and interviewer. Based on the candidate's resume, self description, and job description, generate a comprehensive interview report that includes:
                    1. Act as a Senior Hiring Lead. Analyze [Resume], [Self-Description], and [Job Description] for any role.
                    2. matchScore: 0-100 based on the overlap of skills and current 2026 industry standards.
                    3. technicalQuestions: 5-8 short, high-impact questions based on the latest trends (e.g., AI-integration, performance, or modern architecture).
                    4. intention: 1-line explanation of why this specific question is being asked for this role.
                    5. hint: A 2-line strategic guide on HOW to answer (e.g., 'Discuss the trade-off between X and Y...').
                    6. behavioralQuestions: 5-8 scenario-based questions focusing on adaptability and AI-augmented workflows.
                    7. skillGaps: Identify gaps with 'Low/Medium/High' severity based on the 'latest buzz' for that specific job title.
                    8. preparationPlan: A 7-day actionable, day-wise roadmap tailored to fix the identified High-severity gaps.
                    9. Constraints: NO long paragraphs. NO full scripts. NO text outside the JSON.
                    10. Style: Ensure all content reflects 2026 trends (e.g., Server Components for Web, LLM-ops for AI, Automation for DevOps).
                    
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

    return parsed;

}


// 3. Your actual PDF generation function
const GenerateHtmltoPdf = async ({ html }) => {
    // Grab the existing running browser
    const browser = await getBrowser();

    // Open a new "tab"
    const page = await browser.newPage();

    await page.setViewport({ width: 794, height: 1123 });

    await page.setContent(html, { waitUntil: "networkidle0" });

    // ensure fonts loaded
    await page.evaluateHandle("document.fonts.ready");
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    // 4. CRITICAL: Only close the TAB, do not close the browser
    await page.close();

    return pdfBuffer;
};


export const GenerateHtmlContent = async ({ resume, selfDescription, jobDescription }) => {

    const PromptForHtml = `
            ### THE MISSION
            You are an Elite Technical Resume Writer and HR Architect. Your task is to extract the provided resume data, aggressively optimize the vocabulary for a 95+ ATS score, and inject it into the provided premium HTML template.

            ### INPUT DATA
            - **Resume:** ${resume}
            - **Persona:** ${selfDescription}
            - **Target Job:** ${jobDescription}

            ### PAGE LENGTH & CONTENT MATRIX (STRICT)
            - **0 - 4 Years Experience:** STRICTLY 1 PAGE.
            - **5 - 9 Years Experience:** 2 PAGES ALLOWED.
            - **10+ Years Experience:** 2 PAGES STRICTLY.
            - **NO TRUNCATION OF ROLES:** You MUST include EVERY single project and EVERY single work experience listed in the original [Resume]. Create a new <div class='item'> block for each.

            ### THE "HIGH-DENSITY" SYNTHESIS RULE (CRITICAL)
            To fit all roles within the page limits, you must synthesize the bullet points. DO NOT simply delete information.
            1. **Work Experience:** STRICTLY 3 bullet points per job. Combine tasks, metrics, and tools into these 3 dense points.
            2. **Projects:** STRICTLY 3 bullet points per project. Ensure these 3 points cover architecture, integration, optimization, and results.

            ### CONTENT OPTIMIZATION & KEYWORD RULES
            1. **Elite Vocabulary:** Upgrade the phrasing.
            2. **Action-Metric-Result:** Every bullet MUST include strong action verbs and exact metrics.
            3. **Trending Keywords:** Naturally weave modern tech terms into the summary and projects.
            4. **No AI Fluff:** Do not use words like "delved," "spearheaded," "testament," or "symphony." Keep it objective and executive.

            ### EXACT HTML TEMPLATE TO USE
            You MUST output ONLY valid, raw HTML. Do not wrap it in JSON. Do not include markdown code blocks (like \`\`\`html). Only populate the [INJECT...] placeholders in the template below.

        <!DOCTYPE html>
        <html lang='en'>
        <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
        /* PREMIUM OVERLEAF/LATEX STYLE CSS */
        @import url('https://fonts.googleapis.com/css2?family=Liberation+Serif:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Liberation Serif', 'Times New Roman', serif;
            font-size: 11.5px;
            line-height: 1.5;
            color: #1e293b;
            background: #fff;
            -webkit-print-color-adjust: exact;
        }
        
        .page {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px 40px;
        }
        
        header { text-align: center; margin-bottom: 16px; }
        header h1 { 
            font-family: 'Inter', sans-serif; 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 4px; 
            color: #0f172a; 
            letter-spacing: 0.5px;
        }
        .subtitle { 
            font-family: 'Inter', sans-serif; 
            font-size: 13px; 
            font-weight: 600; 
            margin-bottom: 6px; 
            color: #2563eb; 
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .contact-info { font-size: 11px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .contact-info a { color: #1e293b; text-decoration: none; font-weight: bold; }
        
        section { margin-bottom: 16px; }
        h2.section-title {
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
            border-bottom: 1.5px solid #0f172a;
            padding-bottom: 3px;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
        }
        
        .skills-table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .skills-table td { padding: 3px 0; vertical-align: top; }
        .skills-table td:first-child { font-weight: bold; width: 135px; color: #0f172a; }
        
        .item { margin-bottom: 12px; page-break-inside: avoid; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; }
        .item-title { font-weight: 700; font-size: 12.5px; color: #0f172a; }
        .item-date { font-weight: 700; font-size: 11px; color: #475569; }
        .item-sub { display: flex; justify-content: space-between; align-items: baseline; font-style: italic; font-size: 11px; margin-bottom: 6px; color: #334155; }
        
        ul { padding-left: 18px; margin-top: 2px; }
        li { margin-bottom: 4px; font-size: 11px; text-align: justify; }
        li b { color: #0f172a; font-weight: 700; }
        
        @media print {
            @page { size: A4; margin: 0; }
            .page { padding: 30px 40px; }
        }
        </style>
        </head>
        <body>
        <div class='page'>

        <header>
            <h1>[INJECT FULL NAME]</h1>
            <div class='subtitle'>[INJECT TARGET JOB TITLE]</div>
            <div class='contact-info'>
            <span>[INJECT PHONE]</span> | 
            <a href='mailto:[INJECT EMAIL]'>[INJECT EMAIL]</a> | 
            <a href='[INJECT GITHUB LINK]'>GitHub</a> | 
            <a href='[INJECT LINKEDIN LINK]'>LinkedIn</a> | 
            <a href='[INJECT PORTFOLIO LINK]'>Portfolio</a>
            </div>
        </header>

        <section>
            <h2 class='section-title'>Professional Summary</h2>
            <p style='text-align: justify; font-size: 11px;'>[INJECT OPTIMIZED SUMMARY HERE - Max 4 lines. Highlight key tech stack.]</p>
        </section>

        <section>
            <h2 class='section-title'>Technical Skills</h2>
            <table class='skills-table'>
            <tr><td>Languages:</td><td>[INJECT LANGUAGES]</td></tr>
            <tr><td>Frontend / UI:</td><td>[INJECT FRONTEND]</td></tr>
            <tr><td>Backend / APIs:</td><td>[INJECT BACKEND]</td></tr>
            <tr><td>Cloud & Databases:</td><td>[INJECT DATABASES]</td></tr>
            <tr><td>Tools & DevOps:</td><td>[INJECT TOOLS]</td></tr>
            </table>
        </section>

        <section>
            <h2 class='section-title'>Work Experience</h2>
            <div class='item'>
            <div class='item-header'>
                <span class='item-title'>[INJECT COMPANY NAME]</span>
                <span class='item-date'>[INJECT DATE RANGE]</span>
            </div>
            <div class='item-sub'>
                <span>[INJECT JOB TITLE]</span>
                <span>[INJECT LOCATION]</span>
            </div>
            <ul>
                <li>[INJECT SYNTHESIZED BULLET 1 WITH <b>BOLD KEYWORDS</b>]</li>
                <li>[INJECT SYNTHESIZED BULLET 2]</li>
                <li>[INJECT SYNTHESIZED BULLET 3]</li>
            </ul>
            </div>
        </section>

        <section>
            <h2 class='section-title'>Technical Projects</h2>
            <div class='item'>
            <div class='item-header'>
                <span class='item-title'>[INJECT PROJECT NAME] | <a href='[INJECT LINK]'>Live Demo</a></span>
                <span class='item-date'>[INJECT DATE OR LEAVE BLANK]</span>
            </div>
            <div class='item-sub'>
                <span>[INJECT TECH STACK USED]</span>
                <span></span>
            </div>
            <ul>
                <li>[INJECT SYNTHESIZED BULLET 1 WITH <b>BOLD KEYWORDS</b>]</li>
                <li>[INJECT SYNTHESIZED BULLET 2]</li>
                <li>[INJECT SYNTHESIZED BULLET 3]</li>
                <li>[INJECT SYNTHESIZED BULLET 4]</li>
            </ul>
            </div>
        </section>

        <section>
            <h2 class='section-title'>Education</h2>
            <div class='item'>
            <div class='item-header'>
                <span class='item-title'>[INJECT DEGREE NAME]</span>
                <span class='item-date'>[INJECT DATE]</span>
            </div>
            <div class='item-sub'>
                <span>[INJECT UNIVERSITY NAME]</span>
                <span>[INJECT LOCATION]</span>
            </div>
            <ul style='list-style-type: none; padding-left: 0;'>
                <li>[INJECT GPA/ACHIEVEMENTS]</li>
            </ul>
            </div>
        </section>

        </div>
        </body>
        </html>"
            }
     `;

    //gemini-3-flash-preview
    const response = await genai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: PromptForHtml,

    })

    // 1. Get the raw text directly (it's pure HTML now)
    // Note: If you are using an older SDK version, you might need response.text() instead
    let rawHtml = response.text;

    // 2. Safeguard: Strip markdown blocks just in case Gemini wraps the response in ```html ... ```
    rawHtml = rawHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim();

    // 3. Pass the raw HTML straight to Puppeteer! NO JSON.parse() needed.
    const pdfbuffer = await GenerateHtmltoPdf({ html: rawHtml });

    return pdfbuffer
}


