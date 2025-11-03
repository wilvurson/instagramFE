"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}

export const UsersBar = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://instagram-back-end-i361.onrender.com/users");
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
      <div className="fixed right-0 top-0 h-full w-[200px] bg-black border-l border-stone-800 p-4 text-white">
        Loading users...
      </div>
    );

  return (
    <div className="fixed right-0 top-0 h-full w-[200px] bg-black border-l border-stone-800 p-4 overflow-y-auto cursor-default">
      <div className="text-white text-lg font-semibold mb-4 block">
        Users
      </div>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <Link
            key={user._id}
            href={`/${user.username}`}
            className="flex items-center gap-2 hover:bg-neutral-900 px-3 py-2 rounded-lg transition-colors"
          >
            <Image
              src={user.profilePicture || "/default-avatar.png"}
              alt={`${user.username}'s profile`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="text-white font-medium truncate">
              @{user.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
