import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user.model";
import { redis } from "../config/redis.config";
import { generateOtp, generateToken } from "../utils/auth";
import sendMail from "../utils/sendMail";
import ErrorHandler from "../utils/errorHandler";


// SIGNUP -->
export const requestSignupOtp = async (req: Request, res: Response, next:NextFunction) => {
  
  try {

    const { name, email, dob } = req.body;
    
    if (!name || !email || !dob) {
      return next(new ErrorHandler("name, email, or dob cannot be empty", 400));
    }
    const existing = await User.findOne({ email });

    if (existing) {
      return next(new ErrorHandler("User already exists",400));
    }

    const otp = generateOtp();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const payload = JSON.stringify({ name, dob, hashedOtp });

    // store otp in redis
    await redis.setex(`signup:${email}`, 300, payload); // 5 min TTL
    await sendMail({email,otp})  // send otp to user email

    res.status(200).json({
        success: true, 
        message: "OTP sent for signup" 
    });

  } catch (err:any) {
    console.error("Signup OTP error:", err);
    next(new ErrorHandler(err.message || "Internal server error", 500));
  }
};

export const verifySignupOtp = async (req: Request, res: Response, next:NextFunction) => {

  try {

    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new ErrorHandler("Email or otp cannot be empty", 400));
    }
    const data = await redis.get(`signup:${email}`);

    if (!data) {
      return next(new ErrorHandler("OTP expired or not requested",400));
    }

    const { name, dob, hashedOtp } = JSON.parse(data);
    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== hashedInput){
      return next(new ErrorHandler("Invalid OTP",400));
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new ErrorHandler("User already exists",400));
    }

    const newUser = new User({ name, dob, email });
    await newUser.save();
    await redis.del(`signup:${email}`);

    const token = generateToken(newUser.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000,
    });

    res.status(201).json({ 
        success: true, 
        user: newUser, 
        token 
    });

  } catch (err:any) {
    console.error("Signup OTP verify error:", err);
    next(new ErrorHandler(err.message || "Internal server error", 500));
  }
};


// LOGIN -->
export const requestLoginOtp = async (req: Request, res: Response, next:NextFunction) => {

  try {
    const { email } = req.body;
    if(!email){
      return next(new ErrorHandler("Email cannot be empty",400));
    }
    const user = await User.findOne({ email });

    if (!user){
      return next(new ErrorHandler("User not found",404));
    }

    const otp = generateOtp();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await redis.setex(`login:${email}`, 300, JSON.stringify({ hashedOtp }));
    await sendMail({email,otp}) // send otp to user

    res.status(200).json({ 
        success: true, 
        message: "OTP sent for login" 
    });

  } catch (err:any) {
    console.error("Login OTP error:", err);
    next(new ErrorHandler(err.message || "Internal server error", 500));
  }
};


export const verifyLoginOtp = async (req: Request, res: Response, next:NextFunction) => {

  try {

    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new ErrorHandler("Email or otp cannot be empty", 400));
    }

    const user = await User.findOne({ email });
    if (!user){
      return next(new ErrorHandler("User not found",404));
    }

    const data = await redis.get(`login:${email}`);
    if (!data) {
      return next(new ErrorHandler("OTP expired or not requested",400));
    }

    const { hashedOtp } = JSON.parse(data);
    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== hashedInput){
      return next(new ErrorHandler("Invalid OTP",400));
    }

    await redis.del(`login:${email}`);

    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000,
    });

    res.status(200).json({ 
        success: true, 
        user, 
        token 
    });

  } catch (err:any) {
    console.error("Login OTP verify error:", err);
    next(new ErrorHandler(err.message || "Internal server error", 500));
  }
};

// GET MY PROFILE
export const myProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    const user = await User.findById(userId).select("-otp -otpExpires");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err: any) {

    console.error("MyProfile Error:", err);
    return next(new ErrorHandler(err.message || "Internal Server Error", 500));
  }
};


// LOGOUT -->
export const logout = async (_req: Request, res: Response) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true, 
    message: "Logged out successfully" 
});
};
