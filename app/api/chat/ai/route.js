export const maxDuration=60;
import OpenAI from "openai";
import { getAuth } from "@clerk/nextjs/server";
import  Chat  from "../../../models/Chat.js";
import connectDB from "../../../config/db";
import { NextResponse } from "next/server";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req) {
  try {
    const {userId}=getAuth(req);
    const {chatId,prompt}=await req.json();

    if(!userId){
        return Response.json({success:false,message:"Unauthorized"},{status:401});
    }
    await connectDB();
    const data=await Chat.findOne({userId,_id:chatId});
    const userPrompt={
      role:"user",
      content:prompt,
      timestamp:new Date(),
    }
    data.messages.push(userPrompt);
    await data.save();
     const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "deepseek-chat",
    store: true,
    stream:true
  });
  const message=completion.choices[0].message;
  message.timestamp=new Date();
  data.messages.push(message);
  await data.save();
    return Response.json({success:true,message:message.content},{status:200});
  }
    catch (error) {
     return Response.json({ success: false, message: error.message }, { status: 500 });
    }

}

// Error pata chal gia isi file me hai ai response nhi de rha