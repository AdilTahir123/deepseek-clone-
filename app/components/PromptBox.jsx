"use client";
import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    e?.preventDefault();
    const promptCopy = prompt.trim();
    // console.log("Sending prompt:", promptCopy);
    if (!user) return toast.error("You must be logged in to send a prompt");
    if (!promptCopy) return toast.error("Prompt cannot be empty");
    if (!selectedChat) return toast.error("No chat selected. Cannot send prompt.");
    if (isLoading) return toast.error("Please wait for the current response");
  
    setIsLoading(true);
  
    setPrompt("");

    try {
      const userPrompt = {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
      };

      // Add user message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat?._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userPrompt] }
            : chat
        )
      );
      // console.log("Updated chats with user prompt:", chats);

      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, userPrompt],
      }));
      // console.log("Updated selectedChat with user prompt:", selectedChat);
      // // Call AI API
      const { data } = await axios.post("/api/chat/ai", {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (!data?.data) {
        toast.error(data?.message || "Failed to get response from AI");
        return;
      }

      const messageTokens = data.data.content.split(" ");

      // Add an empty assistant message first
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: "assistant", content: "", timestamp: Date.now() }],
      }));
      // console.log(selectedChat);

      // Typing animation
      messageTokens.forEach((_, i) => {
        setTimeout(() => {
          setSelectedChat((prev) => {
            if (!prev) return prev;

            const updatedMessages = [
              ...prev.messages.slice(0, -1), // all except last
              {
                role: "assistant",
                content: messageTokens.slice(0, i + 1).join(" "),
                timestamp: Date.now(),
              },
            ];
            
            return { ...prev, messages: updatedMessages };
          });
        }, i * 100);
      });

      // Also update chats sidebar
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, { role: "assistant", content: data.data.content, timestamp: Date.now() }] }
            : chat
        )
      );
    } catch (error) {
      toast.error(error.message || "Error sending prompt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message DeepSeek"
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>

          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <Image src={assets.pin_icon} alt="pin" className="h-5" />
          <button
            type="submit"
            className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}
          >
            <Image
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;