import {Router} from "express"
import { getMeController, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimite.js";
export const authRouter = Router();


/**
 * @route       POST    /api/auth/register
 * @description --> Register a new user
 * @access  public
*/

authRouter.post('/register' , registerLimiter , registerUser)


/**
 * @route       POST    /api/auth/login
 * @description --> login user with email and Password
 * @access  public
*/

authRouter.post('/login' ,loginLimiter, loginUser)


/**
 * @route       Get    /api/auth/logout
 * @description --> Logout user by blacklisting the token 
 * @access  public
*/

authRouter.get('/logout' , logoutUser)


/**
 * @route   Get  api/auth/get-me
 * @description --> Get the details of the logged in user
 * @access  private
 */

authRouter.get("/getme" ,authUser , getMeController)