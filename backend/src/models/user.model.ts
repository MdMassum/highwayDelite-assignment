
import mongoose from "mongoose";
import validator from 'validator'

export interface IUser extends Document {
  name: string;
  email: string;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({

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
  }
  
},{timestamps : true});

export default mongoose.model<IUser>("User", UserSchema);