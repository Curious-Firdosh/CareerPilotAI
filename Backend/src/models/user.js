import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "Username Already Taken"]
    },
    email: {
        type: String,
        unique: [true, "Account Already Exist With this Email addres "],
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false // 🔐 never send password by default
    },
    plan: {
        type: String,
        enum: ["Free", "Pro"],
        default: "Free",

    },
    usageHistory: [
        {
            type: {
                type: String, // "resume_analysis", "pdf_generation"
                enum: ["Resume Analysis", "PDF Generation", "Pdf Refund" , "Refund - Resume Analysis"],
            },
            creditsUsed: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    credits: {
        type: Number,
        default: 30
    },
    // ⏳ Credit expiry (optional but strong)
    creditExpiry: {
        type: Date
    },
    isGeneratingPdf: {
        type: Boolean,
        default: false

    },
    isGeneratingReport: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema)

export default User;