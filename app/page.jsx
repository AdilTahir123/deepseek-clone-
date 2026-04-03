"use client";
import React, { useState } from "react";
import PromptBox from './components/PromptBox.jsx';
import Image from "next/image";
import { assets } from "@/assets/assets";
import Sidebar from "./components/Sidebar.jsx";
import ChatLabel from './components/ChatLabel.jsx'
import Message from './components/Message.jsx'
const Home = () => {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar expand={expand} setExpand={setExpand} />
      {/* Main Content */}
      <div className=" flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
        {/* Mobile Top Bar */}
        <div className="md:hidden absolute top-6 left-0 px-4 flex items-center justify-between w-full">
          <Image
            onClick={() => setExpand(!expand)}
            className="rotate-180 cursor-pointer rounded p-1"
            src={assets.menu_icon}
            alt="menu icon"
            width={24}
            height={24}
          />
          <Image
            className="opacity-70 cursor-pointer"
            src={assets.chat_icon}
            alt="chat icon"
            width={24}
            height={24}
          />
        </div>

        {messages.length == 0 ? (
          <>
            <div className="flex items-center gap-3">
              <Image
                src={assets.logo_icon}
                alt="DeepSeek logo"
                width={48}
                height={48}
              />
              <p className="text-xl font-medium">Hi, I&apos;m DeepSeek.</p>
            </div>
            <p className="text-sm mt-2 text-gray-300">
              How can I help you today?
            </p>
          </>
        ) : (
          <div>
            <Message role='ai' content='what is next js?'/>
          </div>
        )}

        {/* Prompt box will come here */}
            <PromptBox isLoading={isLoading} setIsLoading={setIsLoading}/>
        <p className="text-xs absolute bottom-1 text-gray-400">
          AI-generated, for reference only
        </p>
       
      </div>
   
    </div>
  );
};

export default Home;
