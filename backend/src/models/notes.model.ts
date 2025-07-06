import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  completed:boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true
    },
    completed: {
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", noteSchema);
