import { Webhook } from "svix";
import { headers } from "next/headers";
import connectDB from "../../config/db";
import User from "../../models/User";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return Response.json(
      { success: false, message: "Missing SIGNING_SECRET" },
      { status: 500 }
    );
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  // Check headers
  if (
    !svixHeaders["svix-id"] ||
    !svixHeaders["svix-timestamp"] ||
    !svixHeaders["svix-signature"]
  ) {
    return Response.json(
      { success: false, message: "Missing Svix headers" },
      { status: 400 }
    );
  }

  // Raw body for Svix verification
  const body = await req.text();

  let evt;

  try {
    evt = wh.verify(body, svixHeaders);
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    return Response.json(
      { success: false, message: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const { data, type } = evt;

  // Prepare safe user data
  const userData = {
    _id: data.id,
    email: data.email_addresses?.[0]?.email_address || "",
    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
    image: data.image_url || "",
  };

try {
  const conn = await connectDB();
  console.log("MongoDB connected:", !!conn?.connection?.readyState); // 1 = connected
} catch (err) {
  console.error("MongoDB connection failed:", err);
  return Response.json({ success: false, message: "DB connection failed" }, { status: 500 });
}
  try {
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log("Unhandled webhook type:", type);
        break;
    }

    return Response.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}