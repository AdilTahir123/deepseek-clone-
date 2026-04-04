"use client";
import React, { use, useEffect, useRef, useState } from "react";
import PromptBox from './components/PromptBox.jsx';
import Image from "next/image";
import { assets } from "@/assets/assets";
import Sidebar from "./components/Sidebar.jsx";
import ChatLabel from './components/ChatLabel.jsx'
import Message from './components/Message.jsx'
import { useAppContext } from "./context/AppContext.jsx";
const Home = () => {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {selectedChat} = useAppContext();
  const containerRef=useRef(null);
  useEffect(() => {
    if(selectedChat){
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);
  useEffect(() => { 
if(containerRef.current){
  containerRef.current.scrollTo({top:containerRef.current.scrollHeight, behavior:"smooth"})
}
  },[messages]);
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
          <div ref={containerRef} className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto">
            <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
              {selectedChat.name}
            </p>
            {messages.map((msg, index) => (
              <Message key={index} role={msg.role} content={msg.content} />
            ))}
          </div>
        )}
      {
        isLoading && (
          <div className="flex gap-4 max-w-3xl w-full py-3">
            <Image className="h-9 w-9 p-1 border border-white/15 rounded-full" src={assets.logo_icon} alt="logo"/>
            <div className="loader flex justify-center items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-white animate-bounce">
                </div>
                 <div className="w-1 h-1 rounded-full bg-white animate-bounce">
                </div>
                 <div className="w-1 h-1 rounded-full bg-white animate-bounce">
                </div>
              </div>
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
