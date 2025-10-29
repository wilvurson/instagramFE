"use client";

import Link from "next/link";
import {
  Home,
  Search,
  Compass,
  Clapperboard,
  MessageCircle,
  Heart,
  SquarePlus,
  User,
  Menu,
  Instagram,
} from "lucide-react";
import { useUser } from "../providers/UserProvider";

export const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="fixed left-0 top-0 h-full w-[80px] bg-black border-r border-neutral-800 flex flex-col justify-between items-center py-4 text-white">

      <Link href={"/"} className="mb-15">
        <Instagram />
      </Link>

      <div className="flex flex-col gap-6 items-center">
        <Link href={"/"}>
          <Home size={26} />
        </Link>
        <Search size={26} />
        <Compass size={26} />
        <Clapperboard size={26} />
        <MessageCircle size={26} />
        <Heart size={26} />
        <Link href={"/create"}>
          <SquarePlus size={26} />
        </Link>

        {user ? (
          <Link href={`/${user.username}`}>
            <User size={26} />
          </Link>
        ) : (
          <User size={26} />
        )}
      </div>

      <div className="mt-auto">
        <Menu size={26} />
      </div>
    </div>
  );
};
