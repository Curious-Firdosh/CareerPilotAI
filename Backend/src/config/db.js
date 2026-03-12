import mongoose from "mongoose";
import { ENV } from "../utils/ENV.js";

export const DbConnect = async () => {

    try {
        await mongoose.connect(ENV.Mongodb_Url);
        console.log("Data Base Connected Successfully");
    }
    catch (error) {
        console.log('Faild to Connect with Database"' , error);
        
        process.exit(1)
    }
}  

