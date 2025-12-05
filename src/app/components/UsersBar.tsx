"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Terminal, Heart } from "lucide-react";

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  followers?: any[];
}

export const UsersBar = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://instagram-back-end.vercel.app/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.body || data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="hidden md:flex fixed right-0 top-0 h-full w-[200px] bg-black border-l border-stone-800 p-4 text-white">
        Loading users...
      </div>
    );

  return (
    <div className="hidden md:flex fixed flex-col right-0 top-0 h-full bg-black border-l border-stone-800 p-4 overflow-y-auto cursor-default">
      <div className="text-white text-lg font-semibold mb-4">Users</div>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <Link
            key={user._id}
            href={`/${user.username}`}
            className="flex items-center gap-2 hover:bg-neutral-900 px-3 py-2 rounded-lg transition-colors"
          >
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt=""
                width={40}
                height={40}
                className="rounded-full object-cover bg-stone-900 border-2 border-stone-600 w-10 h-10"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-stone-700 border-2 border-stone-600" />
            )}

            <div className="flex items-center gap-1">
              <span className="text-white font-medium truncate">
                @{user.username}
              </span>

              <span className="flex items-center gap-1">
                {user.username === "wilvurson" && (
                  <>
                    <BadgeCheck className="w-4 h-4 blue-glow" />
                    <Heart className="w-4 h-4 blue-cyan-glow" />
                  </>
                )}

                {user.username === "elvur" && (
                  <>
                    <BadgeCheck className="w-4 h-4 blue-glow" />
                    <Heart className="w-4 h-4 blue-cyan-glow" />
                  </>
                )}

                {user.username !== "wilvurson" &&
                  user.username !== "elvur" &&
                  user.followers &&
                  user.followers.length >= 10 && (
                    <BadgeCheck className="w-4 h-4 blue-glow" />
                  )}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
