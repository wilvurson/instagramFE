"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";
import { Navbar } from "../components/Navbar";
import { Post, User, Follower } from "../types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, X, Heart, MessageCircle, Send } from "lucide-react";
import { PostCard } from "../components/PostCard";

const ProfilePage = () => {
  const { username } = useParams();
  const axios = useAxios();
  const { user: currentUser } = useUser();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const userRes = await axios.get(`/users/${username}`);
        const userData: User & { followers: Follower[] } = userRes.data;
        setUser(userData);

        const follows = userData.followers?.some(
          (f) => f.createdBy._id === currentUser?._id
        );
        setIsFollowing(follows || false);
        setFollowerCount(userData.followers?.length || 0);

        const postRes = await axios.get<Post[]>(`/posts/user/${username}`);
        setPosts(postRes.data);
      } catch (err: any) {
        if (err.response?.status === 404) setIsNotFound(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser?._id]);

  const handleFollow = async () => {
    if (!user) return;
    const prevState = isFollowing;
    const prevCount = followerCount;

    setIsFollowing(!prevState);
    setFollowerCount(prevCount + (prevState ? -1 : 1));

    try {
      const response = await axios.post(`/users/${user.username}/follow`);
      setIsFollowing(response.data.isFollowing);
      if (typeof response.data.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }
    } catch (err) {
      console.error(err);
      setIsFollowing(prevState);
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
  const profileSrc =
    user?.profilePicture && user.profilePicture !== ""
      ? user.profilePicture
      : "/default-avatar.png";

  return (
    <div className="min-h-screen bg-black text-white w-full cursor-default">
      <Navbar />

      {/* Header */}
      <div className="w-full flex justify-center pt-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10 mb-8">
          <div className="flex justify-center md:block mb-6 md:mb-0">
            <Image
              src={profileSrc}
              alt="Profile Picture"
              width={160}
              height={160}
              className="rounded-full object-cover bg-stone-900 border-2 border-stone-600 h-40 w-40"
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

            <div className="text-sm leading-snug mb-4 flex flex-col gap-y-4">
              <span className="font-semibold">{user?.fullname}</span>
              <p className="text-stone-500">{user?.bio || "No bio yet."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Follow/Edit Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        {isOwnProfile ? (
          <Link
            href="/edit/profile"
            className="mt-2 px-4 py-2 rounded-xl bg-[#262626] text-white hover:bg-[#363636] transition"
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

      <div className="border-t border-stone-800 mt-8 mb-8" />

      {/* Posts Grid */}
      <div className="flex justify-center mt-8">
        <div className="grid grid-cols-3 gap-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="relative w-40 h-40 rounded-2xl overflow-hidden group border-2 border-stone-800 hover:border-stone-600 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Heart className="w-5 h-5 fill-white" />
                    <span className="text-sm font-semibold">
                      {post.likes?.length ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span className="text-sm font-semibold">
                      {post.comments?.length ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Send className="w-5 h-5 fill-white" />
                    <span className="text-sm font-semibold">
                      {post.shares?.length ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 mt-10">
              No posts yet
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[90%] flex max-w-xl h-auto max-h-[80vh] overflow-auto rounded-2xl">
            <PostCard
              post={selectedPost}
              onDelete={(id) => {
                setPosts(posts.filter((p) => p._id !== id));
                setSelectedPost(null);
              }}
            />
          </div>
          <button
            className="absolute top-5 right-5 text-stone-400 hover:text-white cursor-pointer text-3xl"
            onClick={() => setSelectedPost(null)}
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
