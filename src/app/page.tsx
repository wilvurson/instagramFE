"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "./providers/UserProvider";
import { redirect } from "next/navigation";
import { Navbar } from "./components/Navbar";
import { Post } from "./types";
import { PostCard } from "./components/PostCard";
import { UsersBar } from "./components/UsersBar";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    fetch("https://instagram-back-end-i361.onrender.com/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  if (loading) return <>Loading....</>;
  if (!user) return redirect("/signin");

  return (
    <div className="bg-black min-h-screen text-white flex justify-center">
      <Navbar />
      <UsersBar />
      <div className="md:ml-[80px] md:mr-[200px] pb-[80px] md:pb-0 flex flex-col gap-6 mx-auto w-full max-w-[600px] px-2 md:px-0">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
