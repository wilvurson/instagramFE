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
import { toast } from "sonner";
import {
  BadgeCheck,
  X,
  Heart,
  MessageCircle,
  Send,
  Terminal,
} from "lucide-react";
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

      <div className="w-full flex justify-center pt-6 md:pt-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10 mb-3 md:mb-8">

          <div className="flex justify-center md:block mb-2.5 md:mb-0">
            <Image
              src={profileSrc}
              alt="Profile Picture"
              width={160}
              height={160}
              className="rounded-full object-cover bg-stone-900 border-2 border-stone-600 
        h-24 w-24 sm:h-28 sm:w-28 md:h-40 md:w-40"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 md:gap-2 mb-1.5 md:mb-4">
              <h1 className="text-xl font-semibold flex items-center gap-1.5">
                {user?.username}

                {user?.username === "wilvurson" ? (
                  <span className="flex items-center gap-1">

                    {followerCount >= 0 && (
                      <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 blue-glow" />
                    )}

                    <Terminal className="w-5 h-5 md:w-6 md:h-6 rainbow" />

                    
                  </span>
                ) : (
                  followerCount >= 10 && (
                    <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-black fill-sky-500" />
                  )
                )}
              </h1>
            </div>

            <div className="flex justify-center md:justify-start gap-4 md:gap-8 mb-1.5 md:mb-4 text-sm">
              <span>{posts.length} posts</span>
              <span>{followerCount} followers</span>
              <span>{user?.followings.length} following</span>
            </div>

            <div className="text-sm leading-snug mb-2 md:mb-4 flex flex-col gap-y-1.5 md:gap-y-2">
              <span className="font-semibold">{user?.fullname}</span>
              <p className="text-stone-500">{user?.bio || "No bio yet."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 md:gap-2 mb-4 md:mb-8">
        {isOwnProfile ? (
          <Button
            asChild
            className="bg-white text-black text-sm md:text-base font-semibold w-28 sm:w-32 md:w-40 h-8 md:h-10 hover:bg-stone-200"
          >
            <Link href="/edit/profile">Edit Profile</Link>
          </Button>
        ) : (
          <>
            <Button
              onClick={handleFollow}
              className={`text-sm md:text-base font-semibold w-28 sm:w-32 md:w-40 h-8 md:h-10 px-4 md:px-6 transition-transform active:scale-95 ${
                isFollowing
                  ? "bg-[#262626] text-white hover:bg-[#363636]"
                  : "bg-white text-black hover:bg-stone-200"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>

            <Button
              onClick={() => toast("Doesn't work yet")}
              className="bg-[#262626] text-white text-sm md:text-base font-semibold w-28 sm:w-32 md:w-40 h-8 md:h-10 hover:bg-[#363636]"
            >
              Message
            </Button>
          </>
        )}
      </div>

      <div className="border-t border-stone-800 mt-8 mb-8" />

      <div className="flex justify-center mt-8 px-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="relative rounded-xl overflow-hidden group border-3 border-stone-600 hover:border-white cursor-pointer w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px]"
                onClick={() => setSelectedPost(post)}
              >
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

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
            <div className="col-span-3 text-center text-stone-500 mt-10">
              No posts yet
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-black">
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
