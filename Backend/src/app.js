import express from 'express';
import {authRouter} from "../src/routes/auth.routes.js"
import cookieParser from "cookie-parser"


// * Initialize Express App
const app = express()


//* Middleware
app.use(express.json())
app.use(cookieParser())



// * Routes
app.use('/api/auth' , authRouter)

export default app



