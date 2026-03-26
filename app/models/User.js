import mongoose from "mongoose";

// Schema define karo
const userSchema = new mongoose.Schema(
  {
  _id:{type:String,required:true},
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, // ye automatically createdAt aur updatedAt add karega
  }
);

// Check karo agar model pehle se exist karta hai, dev hot reload me errors na aaye
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;