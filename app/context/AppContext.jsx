// main work is to fetch and create new chat 
"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [chats, setChats] =useState([]);
  const [selectedChat,setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Fetch all chats for logged-in user
  const fetchUsersChats = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Fetched chats:", data);
      if (data.success) {
        if (data.data.length === 0) {
          await createNewChat(false);   // auto create, no toast
          return fetchUsersChats();     // only ONE refetch
        }

        const sortedChats = [...data.data].sort(
             (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setChats(sortedChats);
        setSelectedChat(sortedChats[0]);
        // console.log("Sorted chats:", sortedChats);
        // console.log("Selected chat:", sortedChats[0]);
      } else {
        toast.error(data.message || "Failed to fetch chats");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error fetching chats"
      );
    }
  };

  // 🔹 Create new chat
  const createNewChat = async (showToast = true) => {
    try {
      if (!user) return null;

      const token = await getToken();

      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (showToast) {
        toast.success("New chat created");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return null;
    }
  };

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