import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e); // ✅ event pass karo
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt.trim();

    try {
      if (e) e.preventDefault(); // ✅ safe
      if (!user) return toast.error("You must be logged in to send a prompt");
      if (!promptCopy) return toast.error("Prompt cannot be empty");
      if (!selectedChat)
        return toast.error("No chat selected. Cannot send prompt.", selectedChat); // ✅ safe logging
      if (isLoading) return toast.error("Please wait for the current response");

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat?._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userPrompt] }
            : chat,
        ),
      );

      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, userPrompt],
      }));

      const { data } = await axios.post("/api/chat/ai", {
        chatId: selectedChat._id,
        prompt: promptCopy, // ✅ promptCopy use karo
      });

      if (data.success) 
        {
                  setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat,
          ));

        const message = data.data.content;
        const messageTokens = message.split(" ");

        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        // empty assistant message add first

        setSelectedChat((prevChat) =>
        (
          {
            ...prevChat,
            messages: [...prevChat.messages, assistantMessage],
          }
        )  
        );

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content= messageTokens.slice(0, i + 1).join(" ");

            setSelectedChat((prev) => {
              if (!prev) return prev;

              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage,
              ];

              return { ...prev, messages: updatedMessages };
            });
          }, i * 100);
        }
      } else {
        toast.error(data.message || "Failed to get response from AI");
      }
    } catch (error) {
      toast.error(error.message || "Error sending prompt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${selectedChat?.messages.length>0 ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
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

        <div className="flex gap-2 items-center">
          <Image src={assets.pin_icon} alt="" />
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
