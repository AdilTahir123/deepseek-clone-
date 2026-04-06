import Chat from "../../../models/Chat.js";
import connectDB from "../../../config/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    // 1️⃣ Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // 2️⃣ Connect to DB
    await connectDB();
    // 3️⃣ Get chat ID and new name from request body
    const { chatId, newName } = await req.json();
    // 4️⃣ Update chat name
    const updatedChat = await Chat.findByIdAndUpdate(
         chatId,
      {  name: newName },
      {  new: true }
    );
    // 5️⃣ Return updated chat in response
    return NextResponse.json(
      { success: true, chat: updatedChat },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error renaming chat:", error);
    return NextResponse.json(
      { success: false, message: "Failed to rename chat" },
      { status: 500 }
    );
  }
}