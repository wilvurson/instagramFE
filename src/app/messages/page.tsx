"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { redirect } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Message } from "../types";
import { MessageCard } from "../components/MessageCard";
import { UsersBar } from "../components/UsersBar";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    fetch("https://instagram-back-end.vercel.app/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  }, []);

  if (loading) return <>Loading....</>;
  if (!user) return redirect("/signin");

  return (
    <div className="bg-black min-h-screen text-white flex justify-center">
      <Navbar />
      <UsersBar />
      <div className="md:ml-[80px] md:mr-[200px] pb-[80px] md:pb-0 flex flex-col gap-6 mx-auto w-full max-w-[600px] px-2 md:px-0">
        <div className="flex justify-between items-center mt-6">
          <h1 className="text-2xl font-bold">Global Chat</h1>
          <Link
            href="/messages/create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Plus size={20} />
            New Message
          </Link>
        </div>
        {messages.map((message) => (
          <MessageCard
            key={message._id}
            message={message}
            onDelete={(id) => setMessages(messages.filter((m) => m._id !== id))}
          />
        ))}
      </div>
    </div>
  );
}
