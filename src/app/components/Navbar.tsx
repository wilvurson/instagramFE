"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Home,
  Search as SearchIcon,
  Compass,
  Clapperboard,
  MessageCircle,
  Heart,
  Plus,
  Instagram,
  LogOut,
  BadgeCheck,
} from "lucide-react";
import { useUser } from "../providers/UserProvider";
import { useAxios } from "../hooks/useAxios";
import { Message } from "../types";
import { MessageCard } from "./MessageCard";

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  followers?: any[];
}

export const Navbar = () => {
  const { user, setToken } = useUser();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [posting, setPosting] = useState(false);
  const axios = useAxios();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    window.location.href = "/signin";
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://instagram-back-end.vercel.app/users");
        const data = await res.json();
        setAllUsers(data.body || data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredUsers([]);
      return;
    }
    const filtered = allUsers.filter((u) =>
      u.username.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, allUsers]);

  useEffect(() => {
    if (messagesOpen) {
      fetchMessages();
    }
  }, [messagesOpen]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("https://instagram-back-end.vercel.app/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostMessage = async () => {
    if (!messageText.trim()) return;
    try {
      setPosting(true);
      const response = await axios.post("/messages", { text: messageText });
      if (response.status === 200) {
        setMessageText("");
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error("Error posting message:", error);
    } finally {
      setPosting(false);
    }
  };

  const renderUsernameWithBadge = (u: User) => (
    <div className="flex gap-1 items-center">
      <b className="text-white">@{u.username}</b>
      <span className="flex items-center gap-1">
        {u.username === "wilvurson" && (
          <>
            <BadgeCheck className="w-4 h-4 blue-glow" />
            <Heart className="w-4 h-4 blue-cyan-glow" />
          </>
        )}
        {u.username === "elvur" && (
          <>
            <BadgeCheck className="w-4 h-4 blue-glow" />
            <Heart className="w-4 h-4 blue-cyan-glow" />
          </>
        )}
        {u.username !== "wilvurson" &&
          u.username !== "elvur" &&
          u.followers &&
          u.followers.length >= 10 && (
            <BadgeCheck className="w-4 h-4 blue-glow" />
          )}
      </span>
    </div>
  );

  return (
    <div>
      <div className="hidden md:flex fixed left-0 top-0 h-full w-[80px] bg-black border-r border-neutral-800 flex-col justify-between items-center py-4 text-white">
        <Link href={"/"} className="mb-15 mt-5">
          <Instagram />
        </Link>

        <div className="flex flex-col gap-6 items-center">
          <Link
            href={"/"}
            className="hover:opacity-70 transition-transform active:scale-90"
          >
            <Home size={26} />
          </Link>
          <SearchIcon
            size={26}
            className="hover:opacity-70 cursor-pointer"
            onClick={() => setSearchOpen(!searchOpen)}
          />
          <Compass size={26} className="hover:opacity-70 cursor-pointer" />
          <Clapperboard size={26} className="hover:opacity-70 cursor-pointer" />
          <MessageCircle
            size={26}
            className="hover:opacity-70 cursor-pointer"
            onClick={() => setMessagesOpen(true)}
          />
          <Heart size={26} className="hover:opacity-70 cursor-pointer" />
          <Link
            href={"/create"}
            className="hover:opacity-70 transition-transform active:scale-90"
          >
            <Plus size={30} />
          </Link>

          {user ? (
            <Link href={`/${user.username}`}>
              <Image
                src={user.profilePicture || "/default-avatar.png"}
                alt=""
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-[26px] h-[26px] flex items-center justify-center rounded-full border border-white"
            ></Link>
          )}
        </div>

        <div
          className="mb-2 mt-auto text-red-400 cursor-pointer hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut size={26} />
        </div>

        {searchOpen && (
          <div className="absolute left-[100px] top-10 w-[300px] bg-black rounded-md overflow-y-auto max-h-96 p-2 z-50">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-3 py-1 rounded bg-neutral-900 text-white placeholder-stone-400 focus:outline-none mb-2"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
            />
            {filteredUsers.map((u) => (
              <Link
                key={u._id}
                href={`/${u.username}`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-900 rounded"
                onClick={() => setSearchOpen(false)}
              >
                {u.profilePicture ? (
                  <Image
                    src={u.profilePicture}
                    alt=""
                    width={100}
                    height={100}
                    className="rounded-full object-cover h-11 w-11 border-2 border-stone-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-stone-700" />
                )}
                {renderUsernameWithBadge(u)}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-neutral-800 flex justify-around items-center py-3 text-white z-50">
        <Link href={"/"}>
          <Home size={24} />
        </Link>
        <SearchIcon
          size={24}
          onClick={() => setSearchOpen(true)}
          className="cursor-pointer"
        />
        <Link href={"/create"}>
          <Plus size={28} />
        </Link>
        <MessageCircle
          size={24}
          className="cursor-pointer"
          onClick={() => setMessagesOpen(true)}
        />
        {user ? (
          <Link href={`/${user.username}`}>
            <Image
              src={user.profilePicture || "/default-avatar.png"}
              alt=""
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          </Link>
        ) : (
          <Link href="/login">
            <Heart size={24} />
          </Link>
        )}
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2 md:hidden">
          <div className="bg-black w-full max-w-md rounded-md p-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-3 py-2 rounded bg-neutral-900 text-white placeholder-stone-400 focus:outline-none mb-3"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
            />
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {filteredUsers.map((u) => (
                <Link
                  key={u._id}
                  href={`/${u.username}`}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-900 rounded"
                  onClick={() => setSearchOpen(false)}
                >
                  {u.profilePicture ? (
                    <Image
                      src={u.profilePicture}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full object-cover h-11 w-11 border-stone-700 border-2"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-700" />
                  )}
                  {renderUsernameWithBadge(u)}
                </Link>
              ))}
            </div>
            <button
              className="mt-3 w-full cursor-pointer bg-[#262626] text-white hover:bg-[#363636] py-2 rounded"
              onClick={() => setSearchOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {messagesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2">
          <div className="bg-black w-full max-w-md rounded-md p-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Global Chat</h2>
              <button
                onClick={() => setMessagesOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onDelete={(id) =>
                    setMessages(messages.filter((m) => m._id !== id))
                  }
                />
              ))}
            </div>

            <div className="border-t border-stone-700 pt-4">
              <div className="flex items-center gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 resize-none text-sm text-white placeholder-stone-500 focus:outline-none bg-stone-900 rounded px-3 py-2"
                  rows={2}
                />
                <button
                  onClick={handlePostMessage}
                  disabled={posting || !messageText.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-stone-600 text-white px-4 py-2 rounded font-semibold"
                >
                  {posting ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
