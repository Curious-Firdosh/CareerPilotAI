import express from 'express';
import {authRouter} from "../src/routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { ENV } from './utils/ENV.js';
import { interviewRouter } from './routes/interview.route.js';




// * Initialize Express App
const app = express()

// * CORS Configuration
app.use(cors({
    origin: ENV.Frontend_URL,
    credentials: true
}))



//* Middleware
app.use(express.json())
app.use(cookieParser())



// * Routes
app.use('/api/auth' , authRouter)
app.use('/api/interview' , interviewRouter)


export default app



