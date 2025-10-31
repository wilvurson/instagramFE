"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User, Post } from "../types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";

const ProfilePage = () => {
  const { username } = useParams();
  const axios = useAxios();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const { user: currentUser } = useUser();

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const userRes = await axios.get(`/users/${username}`);
        const userData = userRes.data;
        setUser(userData);

        const follows = userData.followers?.some(
          (f: any) => f.createdBy._id === currentUser?._id
        );

        setIsFollowing(follows);
        setFollowerCount(userData.followers?.length || 0);

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

    const previousState = isFollowing;
    const prevCount = followerCount;

    setIsFollowing(!previousState);
    setFollowerCount(prevCount + (previousState ? -1 : 1));

    try {
      const response = await axios.post(`/users/${user.username}/follow`);
      setIsFollowing(response.data.isFollowing);

      if (typeof response.data.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }
    } catch (err) {
      console.error(err);
      setIsFollowing(previousState);
      setFollowerCount(prevCount);
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
              src={user?.profilePicture || "/default-avatar.png"}
              className="w-32 h-32 rounded-full object-cover border border-gray-700"
              alt="Profile Picture"
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
              <span>{posts.length} posts</span>
              <span>{followerCount} followers</span>
              <span>{user?.followings.length} following</span>
            </div>

            <div className="text-sm leading-snug mb-4">
              <span className="font-semibold block">{user?.fullname}</span>
              <p className="text-gray-300">{user?.bio || "No bio yet."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {isOwnProfile ? (
          <Link
            href="/edit/profile"
            className="mt-2 px-4 py-2 rounded-2xl bg-[#262626] text-white hover:bg-[#363636] transition"
          >
            Edit Profile
          </Link>
        ) : (
          <>
            <Button
              onClick={handleFollow}
              className={`text-sm font-semibold w-40 h-10 px-6 transition-transform active:scale-95 ${
                isFollowing
                  ? "bg-[#262626] text-white hover:bg-[#363636]"
                  : "bg-white text-black hover:bg-stone-200"
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
              <div
                key={post._id}
                className="w-50 h-80 rounded-2xl overflow-hidden group border-2 border-gray-800 hover:border-2 hover:border-gray-200"
              >
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
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
