import React,{useState} from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "../context/AppContext";
import ChatLabel from "./ChatLabel";

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user,chats,createNewChat } = useAppContext();
  const [openMenu,setOpenMenu]=useState({id:0,open: false })
  return (
    <div
      className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all duration-300 z-503 max-md:absolute
         max-md:h-screen ${
           expand ? "p-3 w-64 " : "md:w-20 w-0 max-md:overflow-hidden"
         }`}
    >
      
      {/* Top Section */}
      <div>
        <div
          className={`flex ${
            expand ? "flex-row gap-10" : "flex-col items-center gap-8"
          }`}
        >
          <Image
            src={expand ? assets.logo_text : assets.logo_icon}
            alt="logo"
            className={expand ? "w-36" : "w-10"}
          />

          {/* Toggle Button */}
          <div
            onClick={() => setExpand(!expand)}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 rounded-lg cursor-pointer"
          >
            {/* Mobile icon */}
            <Image
              src={assets.menu_icon}
              alt="menu"
              className="w-6 md:hidden"
            />

            {/* Desktop icon */}
            <Image
              src={assets.sidebar_icon}
              alt="toggle sidebar"
              className="hidden md:block w-7"
            />

            {/* Tooltip */}
            <div
              className={`absolute w-max ${
                expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"
              } opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}
            >
              {expand ? "Close sidebar" : "Open sidebar"}
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand
                    ? "left-1/2 -top-1.5 -translate-x-1/2"
                    : "left-4 -bottom-1.5"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={createNewChat}
          className={`mt-8 flex items-center justify-center cursor-pointer transition-all duration-300 ${
            expand
              ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max"
              : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"
          }`}
        >
          <Image
            className={expand ? "w-6" : "w-7"}
            src={expand ? assets.chat_icon : assets.chat_icon_dull}
            alt="chat"
          />

          {!expand && (
            <div  className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
              New chat
              <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5"></div>
            </div>
          )}
          {expand && <p className="text-white font-medium">New Chat</p>}
        </button>

        {/* History */}
        {expand && (
          <div className="mt-8 text-white/25 text-sm">
            <p className="my-1">Recent</p>
            {chats.map((chat)=><ChatLabel key={chat._id} openMenu={openMenu} setOpenMenu={setOpenMenu} id={chat._id} name={chat.name} />)}
         
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div>
        {/* Get App */}
        <div
          className={`group relative flex items-center cursor-pointer transition-all duration-300 ${
            expand
              ? "gap-2 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10"
              : "h-10 w-10 mx-auto hover:bg-gray-500/20 rounded-lg justify-center"
          }`}
        >
          <Image
            className={expand ? "w-5" : "w-6"}
            src={expand ? assets.phone_icon : assets.phone_icon_dull}
            alt="phone"
          />

          {/* QR Tooltip */}
          <div
            className={`absolute -top-60 pb-8 ${
              !expand ? "-right-40" : "left-1/2 -translate-x-1/2"
            } opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300`}
          >
            <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
              <Image className="w-44" src={assets.qrcode} alt="QR code" />
              <p className="mt-2">Scan to get Deepseek App</p>
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand ? "left-1/2 -translate-x-1/2" : "left-4"
                } -bottom-1.5`}
              ></div>
            </div>
          </div>

          {expand && (
            <>
              <span>Get App</span>
              <Image src={assets.new_icon} alt="new" className="w-7" />
            </>
          )}
        </div>

        {/* Profile */}
        <div
          onClick={user ? null : openSignIn}
          className={`flex items-center ${
            expand ? "hover:bg-white/10 rounded-lg" : "justify-center w-full"
          } gap-3 text-white/60 text-sm mt-2 p-2 cursor-pointer transition-all duration-300`}
        >
          {user ? (
            <UserButton />
          ) : (
            <Image className="w-7" src={assets.profile_icon} alt="profile" />
          )}
          {expand && <span>My Profile</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
