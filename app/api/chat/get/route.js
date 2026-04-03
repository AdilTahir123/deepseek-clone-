import connectDB from "../../../config/db";
import Chat from "../../../models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // 1️⃣ Auth check
    const { userId } = getAuth({ req }); // ✅ pass req
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Connect to DB
    await connectDB();

    // 3️⃣ Fetch chats for the user
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    // 4️⃣ Return chats in 'data' key (for AppContext compatibility)
    return NextResponse.json(
      { success: true, data: chats },
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