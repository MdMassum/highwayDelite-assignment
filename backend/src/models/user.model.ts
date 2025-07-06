
import mongoose from "mongoose";
import validator from 'validator'

const UserSchema = new mongoose.Schema({

  email: {
    type: String, 
    required: true, 
    unique: true,
    validate:[validator.isEmail,"Please Enter a valid Email"]
  },
  name: { 
    type: String, 
    required: true, 
    minLength:[4,"Name should be atleast 4 characters"],
    maxLength:[30,"Name should not exceed 30 characters"],
  },
  dob: {
    type: Date, 
    required: true 
  },
  otp: { 
    type: String, 
  },
  otpExpires: { 
    type: Date, 
  },
  
},{timestamps : true});

export default mongoose.model("User", UserSchema);