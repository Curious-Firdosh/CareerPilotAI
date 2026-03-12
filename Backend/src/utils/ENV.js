import dotenv from "dotenv"
dotenv.config()


export const ENV = {
    Mongodb_Url: process.env.MONGODB_URI|| "",
    JWT_Secret : process.env.JWT_SECRET
}