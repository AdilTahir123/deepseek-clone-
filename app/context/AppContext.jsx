"use client";
import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Fetch all chats for logged-in user
  const fetchUsersChats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        console.log(data.data);
        setChats(data.data);

         if(data.data.length===0){
          await createNewChat();
          return fetchUsersChats(); // Refetch to get the new chat
         }
         else{
          data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setSelectedChat(data.data[0]);
          console.log("Selected Chat:", data.data[0]);
         }
      } else {
        toast.error(data.message || "Failed to fetch chats");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Error fetching chats");
    }
  };

  // 🔹 Create new chat
  const createNewChat = async () => {
    try {
      if (!user) return null;
      const token = await getToken();

    await axios.post("/api/chat/create",{},{
        headers: { Authorization: `Bearer ${token}` },
      });   
      fetchUsersChats(); // Refetch to get the new chat
    } catch (error) {
     toast.error(error.message);
    }
  };

  // 🔹 Send a prompt safely
  // const sendPrompt = async (promptText) => {
  //   if (!promptText || isLoading) return;
  //   setIsLoading(true);

  //   try {
  //     let activeChat = selectedChat;

  //     // No chat selected? Create one
  //     if (!activeChat) {
  //       activeChat = await createNewChat();
  //       if (!activeChat) {
  //         setIsLoading(false);
  //         return toast.error("Failed to create chat");
  //       }
  //     }

  //     const userMessage = {
  //       role: "user",
  //       content: promptText,
  //       timestamp: Date.now(),
  //     };

  //     const updatedChat = {
  //       ...activeChat,
  //       messages: [...(activeChat.messages || []), userMessage],
  //     };

  //     setSelectedChat(updatedChat);
  //     setChats((prev) =>
  //       prev.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat))
  //     );

  //     const { data } = await axios.post("/api/chat/ai", {
  //       chatId: activeChat._id,
  //       prompt: promptText,
  //     });

  //     if (data.success) {
  //       setSelectedChat(data.chat);
  //       setChats((prev) =>
  //         prev.map((chat) => (chat._id === data.chat._id ? data.chat : chat))
  //       );
  //     } else {
  //       toast.error(data.message || "AI failed to respond");
  //     }
  //   } catch (error) {
  //     console.error("SEND PROMPT ERROR:", error);
  //     toast.error(error.response?.data?.message || error.message || "Failed to send prompt");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // 🔹 Auto-fetch chats when user logs in
  useEffect(() => {
    if (user) fetchUsersChats();
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createNewChat,
    fetchUsersChats,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};