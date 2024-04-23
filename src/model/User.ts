import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAT: Date;
  updatedAT: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAT: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAT: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required 😁"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required 😋"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address 🫠"],
  },
  password: {
    type: String,
    required: [true, "Password is required 😅"],
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
    default: true,
  },
  messages: {
    type: [MessageSchema],
    required: true,
    default: [],
  },
});

export const Message = mongoose.model<Message>("Message", MessageSchema);

export const User = mongoose.model<User>("User", UserSchema);
