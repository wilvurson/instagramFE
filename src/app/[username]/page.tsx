"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User, Post } from "../types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useUser } from "../providers/UserProvider";

const ProfilePage = () => {
  const { username } = useParams();
  const axios = useAxios();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const { user: currentUser } = useUser();

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {

        const userRes = await axios.get(`/users/${username}`);
        setUser(userRes.data);

        const follows = userRes.data.followers?.some(
          (f: any) => f.createdBy._id === currentUser?._id
        );
        setIsFollowing(follows);

        const postRes = await axios.get(`/posts/user/${username}`);
        setPosts(postRes.data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 404) setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser?._id]);

  const handleFollow = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`/users/${user.username}/follow`);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center text-2xl mt-8 text-white">Loading...</div>
    );

  if (isNotFound)
    return (
      <div className="text-center text-2xl mt-8 text-white">
        404 user not found
      </div>
    );

  const isOwnProfile = currentUser?.username === user?.username;

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <Navbar />

      <div className="w-full flex justify-center pt-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10 mb-8">

          <div className="flex justify-center md:block mb-6 md:mb-0">
            <img
              className="w-32 h-32 rounded-full object-cover border border-gray-700"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <h1 className="text-2xl font-semibold">{user?.username}</h1>
              <Check />
              <button className="p-2 hover:bg-[#262626] rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-4 text-sm">
              <span>{posts?.length} posts</span>
              <span>{user?.followers.length} followers</span>
              <span>{user?.followings.length} following</span>
            </div>

            <div className="text-sm leading-snug mb-4">
              <span className="font-semibold block">{user?.fullname}</span>
              <p className="text-gray-300">{"No bio yet."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {isOwnProfile ? (
          <Button className="bg-[#262626] text-white text-sm font-semibold w-40 h-10 hover:bg-[#363636]">
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              onClick={handleFollow}
              className={`text-sm font-semibold w-40 h-10 px-6 ${
                isFollowing
                  ? "bg-[#262626] text-white hover:bg-[#363636]"
                  : "bg-[#0051ff] text-white hover:bg-[#1839f2]"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>

            <Button className="bg-[#262626] text-white text-sm font-semibold w-40 h-10 hover:bg-[#363636]">
              Message
            </Button>

            <Button className="bg-[#262626] text-white text-sm font-semibold px-4 h-10 hover:bg-[#363636]">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      <div className="border-t border-gray-800 mt-8 mb-8" />

      <div className="flex justify-center mt-8">
        <div className="posts grid grid-cols-3 gap-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="w-50 h-80 rounded-2xl overflow-hidden group hover:border-2 hover:border-gray-800">
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 mt-10">
              No posts yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;