import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../utils/ENV.js";
import Blacklist from "../models/blacklist.model.js";

/**
 * @controller Register User
 * @route POST /api/auth/register
 * @access Public
 * @description Creates a new user account
 */
export const registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    // 400 → client sent invalid data
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required"
      });
    }

    // check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    // 409 → resource conflict (user already exists)
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email or username"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      ENV.JWT_Secret,
      { expiresIn: "1d" }
    );

    // send cookie securely
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    // 500 → server side error
    return res.status(500).json({
      success: false,
      message: "Server error while registering user"
    });
  }
};


/**
 * @controller Login User
 * @route POST /api/auth/login
 * @access Public
 * @description Authenticates user and returns JWT
 */
export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    // security: don't reveal whether email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      ENV.JWT_Secret,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in"
    });
  }

};


/**
 * @controller LogOut User
 * @route POST /api/auth/logout
 * @access Public
 * @description Logs out the user and invalidates the JWT token and solve Blacklist problem
 * 
 * Note: In a real application, you would want to implement token blacklisting
 *  to invalidate the JWT token on logout. This can be done by storing the token in a blacklist 
 * collection in the database and checking against it on each authenticated request.
 */

export const logoutUser = async (req, res) => {

  try {
    // Clear the token cookie

    const token = req.cookies.token;

    if (token) {
      // Add the token to the blacklist
      await Blacklist.create({ token });
    }

    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while logging out"
    });
  }
};


/**
 * @route   Get  api/auth/get-me
 * @description --> Get the details of the logged in user
 * @access  private
*/

export const getMeController = async (req, res) => {
  try {

    // 1️⃣ Extract user id from middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    // 2️⃣ Fetch user (lean for better performance)
    const user = await User.findById(userId)
      .select("_id username email")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Send response
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {

    console.error("GetMeController Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};