import dotenv from "dotenv"
dotenv.config()


export const ENV = {
    Mongodb_Url: process.env.MONGODB_URI|| "",
    JWT_Secret : process.env.JWT_SECRET,
    Frontend_URL : process.env.Frontend_URL || "http://localhost:5173",
    API_KEY : process.env.API_KEY || ""
}


