import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../config/db";
import Chat from "../../../models/Chat";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ✅ App Router me: await auth()
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ DB connect
    await connectDB();

    // ✅ Fetch chats
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, chats },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}