import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
  const { fetchUsersChats, chats, selectedChat, setSelectedChat } = useAppContext();

  const selectChat = () => {
    const selected = chats.find(chat => chat._id === id);
    setSelectedChat(selected);
  };

  const renameHandler = async () => {
    try {
      const newName = prompt("Enter new name for the chat", name);
      if (!newName) return;
      const { data } = await axios.post("/api/chat/rename", { chatId: id, newName });
      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error renaming chat:", err);
      toast.error("An error occurred while renaming the chat");
    }
  };

  const deleteHandler = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
      if (!confirmDelete) return;
      const { data } = await axios.post("/api/chat/delete", { chatId: id });
      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      toast.error("An error occurred while deleting the chat");
    }
  };

  return (
    <div
      onClick={selectChat}
      className={`flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer ${selectedChat?._id === id ? "bg-white/20" : ""}`}
    >
      <p className="group-hover:max-w-5/6 truncate">{name}</p>
      <div
        onClick={e => { e.stopPropagation(); setOpenMenu(prev => ({ id, open: prev.id === id ? !prev.open : true })); }}
        className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg"
      >
        <Image src={assets.three_dots} alt="" className={`w-4 ${openMenu.id === id && openMenu.open ? '' : 'hidden'} group-hover:block`} />
        <div className={`${openMenu.id === id && openMenu.open ? 'block' : 'hidden'} absolute -right-36 top-6 bg-gray-700 rounded-xl w-max p-2 group-hover:block`}>
          <div onClick={renameHandler} className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
            <Image src={assets.profile_icon} alt="" className="w-4" />
            <p>Rename</p>
          </div>

          <div onClick={deleteHandler} className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
            <Image src={assets.delete_icon} alt="" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;