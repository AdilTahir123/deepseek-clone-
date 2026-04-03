import Chat from "@/models/Chat";
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
    // 3️⃣ Get chat ID from request body
    const { chatId } = await req.json();
    // 4️⃣ Delete chat
    await Chat.findByIdAndDelete(chatId);
    // 5️⃣ Return success response
    return NextResponse.json(
      { success: true, message: "Chat deleted successfully" },
      { status: 200 }
    );
  }
    catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete chat" },
      { status: 500 }
    );
  }
}