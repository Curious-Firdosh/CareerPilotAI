import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:[true , "Username Already Taken"]
    },
    email: {
        type: String,
        unique:[true , "Account Already Exist With this Email addres "],
        required: true
    },
    password :{
        type : String,
        required : true
    }
})

const User = mongoose.model("User" , userSchema)

export default User;