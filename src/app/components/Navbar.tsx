"use client";

import Link from "next/link";
import {
  Home,
  Search,
  Compass,
  Clapperboard,
  MessageCircle,
  Heart,
  Plus,
  Instagram,
  LogOut,
} from "lucide-react";
import { useUser } from "../providers/UserProvider";
import Image from "next/image";

export const Navbar = () => {
  const { user, setToken } = useUser();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    window.location.href = "/signin";
  };

  return (
    <div>

      <div className="hidden md:flex fixed left-0 top-0 h-full w-[80px] bg-black border-r border-neutral-800 flex-col justify-between items-center py-4 text-white">
        <Link href={"/"} className="mb-15 mt-5">
          <Instagram />
        </Link>

        <div className="flex flex-col gap-6 items-center">
          <Link href={"/"} className="hover:opacity-70 transition-transform active:scale-90">
            <Home size={26} />
          </Link>
          <Search size={26} className="hover:opacity-70 cursor-pointer" />
          <Compass size={26} className="hover:opacity-70 cursor-pointer" />
          <Clapperboard size={26} className="hover:opacity-70 cursor-pointer" />
          <MessageCircle size={26} className="hover:opacity-70 cursor-pointer" />
          <Heart size={26} className="hover:opacity-70 cursor-pointer" />
          <Link href={"/create"} className="hover:opacity-70 transition-transform active:scale-90">
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
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-neutral-800 flex justify-around items-center py-3 text-white z-50">
        <Link href={"/"}><Home size={24} /></Link>
        <Search size={24} />
        <Link href={"/create"}><Plus size={28} /></Link>
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
          <Link href="/login"><Heart size={24} /></Link>
        )}
        <div
          className="mt-auto text-red-400 cursor-pointer hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut size={24} />
        </div>
        
      </div>
    </div>
  );
};
