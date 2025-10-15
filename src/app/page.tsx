"use client";
import { useContext, useEffect, useState } from "react";
import { User, UserContext } from "./providers/UserProvider";
import { redirect } from "next/navigation";
import { Navbar } from "./components/Navbar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Heart, SquarePlus, MessageCircle, Send, SaveIcon} from "lucide-react";

dayjs.extend(relativeTime);

type Post = {
  _id: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
  createdBy: User | null;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, setToken, loading } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:5500/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  if (loading) {
    return <>Loading....</>;
  }

  if (!user) {
    return redirect("/signin");
  }

  return (
    <div>
      <Navbar />

      <div className="w-[600px] flex flex-col gap-4 mx-auto ">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-black rounded-lg shadow-md p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="uppercase bg-gray-300 h-8 w-8 rounded-full flex items-center justify-center text-gray-600 font-bold">
                {post.createdBy?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <span className="font-semibold">{post.createdBy?.username}</span>
                <span className="ml-1 text-lg text-gray-400">•</span>
                <span className="text-gray-400 ml-1">  
                  {dayjs(post.createdAt).fromNow()}
                </span>
              </div>
            </div>
            <img
              src={post.imageUrl}
              alt=""
              className="w-full -h-96 object-cover rounded-md"
            />
            <div className="flex justify-between">
            <span className="flex justify-between w-25">
              <Heart />
              <MessageCircle />
              <Send />
            </span>
            <span className="">
              < SaveIcon/>
            </span>
            </div>
            <p className="mt-2 text-gray-800">{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
