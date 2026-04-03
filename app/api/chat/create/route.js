import connectDB from "../../../config/db";
import Chat from "../../../models/Chat";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const newChat = await Chat.create({
      userId,
      messages: [],
      name: "New Chat",
    });

    return NextResponse.json(
      {
        success: true,
        chat: newChat, // 🔥 full object return
        message: "Chat created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create chat" },
      { status: 500 }
    );
  }
}