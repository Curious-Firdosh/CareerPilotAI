import jwt from "jsonwebtoken";
import { ENV } from "../utils/ENV.js";
import Blacklist from "../models/blacklist.model.js";

export const authUser = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Token missing.",
      });
    }

    //! BlackListing the Token
    const isBlackListed = await Blacklist.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message: "TOKEN IS INVALID 😒😒 "
        })
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, ENV.JWT_Secret);

    // 3️⃣ Attach user payload to request
    req.user = decoded;

    // 4️⃣ Move to next middleware/controller
    next();
  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};