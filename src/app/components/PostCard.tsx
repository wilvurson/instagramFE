"use client";

import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, Send, MessageCircle, Bookmark, X } from "lucide-react";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";
import Image from "next/image";

dayjs.extend(relativeTime);

export const PostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [totalComments, setTotalComments] = useState(3);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares.length);
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(post.saves.length);

  const axios = useAxios();
  const { user } = useUser();

  const [text, setText] = useState("");
  const [comments, setComments] = useState(post.comments);

  useEffect(() => {
    if (user) {
      const userId = user._id;
      setIsLiked(post.likes.some((like) => like.createdBy._id === userId));
      setIsShared(post.shares.some((share) => share.createdBy._id === userId));
      setIsSaved(post.saves.some((save) => save.createdBy._id === userId));
    }
  }, [user]);

  const handleSubmitComment = async () => {
    if (!text.trim()) return;
    const response = await axios.post(`/posts/${post._id}/comments`, { text });

    if (response.status === 200) {
      setText("");
      setComments([...comments, response.data]);
    } else {
      toast.error("Error posting comment");
    }
  };

  return (
    <div
      key={post._id}
      className="mb-8 text-white bg-black rounded-2xl overflow-hidden"
    >
      {/* Post Header */}
      <div className="flex items-center gap-2 text-sm text-gray-300 px-4 py-3">
        <Image
          src={post.createdBy.profilePicture || "/default-avatar.png"}
          alt={post.createdBy.username}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <Link href={`/${post.createdBy.username}`}>
          <div className="font-semibold hover:underline">
            {post.createdBy.username}
          </div>
        </Link>
        <div className="text-gray-500">•</div>
        <div className="text-gray-500">{dayjs(post.createdAt).fromNow()}</div>
      </div>

      {/* Post Image */}
      <div className="w-full bg-black flex justify-center">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full max-h-[600px] object-contain bg-black"
          />
        ) : (
          <div className="text-gray-500 p-4">No image available</div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center px-4 py-2">
        <div
          className="hover:opacity-70 cursor-pointer transition-transform active:scale-90"
          onClick={async () => {
            const response = await axios.post(`/posts/${post._id}/like`);
            setIsLiked(response.data.isLiked);
            setLikeCount(likeCount + (response.data.isLiked ? 1 : -1));
          }}
        >
          {isLiked ? (
            <Heart fill="red" stroke="red" />
          ) : (
            <Heart stroke="white" />
          )}
        </div>

        <div
          className="ml-4 hover:opacity-70 cursor-pointer transition-transform active:scale-90"
          onClick={() => setShowAllComments(true)}
        >
          <MessageCircle stroke="white" />
        </div>

        <div
          className="ml-4 hover:opacity-70 cursor-pointer transition-transform active:scale-90"
          onClick={async () => {
            const response = await axios.post(`/posts/${post._id}/share`);
            setIsShared(response.data.isShared);
            setShareCount(shareCount + (response.data.isShared ? 1 : -1));
          }}
        >
          {isShared ? (
            <Send fill="yellow" stroke="yellow" />
          ) : (
            <Send stroke="white" />
          )}
        </div>

        <div
          className="ml-auto hover:opacity-70 cursor-pointer transition-transform active:scale-90"
          onClick={async () => {
            const response = await axios.post(`/posts/${post._id}/save`);
            setIsSaved(response.data.isSaved);
            setSaveCount(saveCount + (response.data.isSaved ? 1 : -1));
          }}
        >
          {isSaved ? (
            <Bookmark fill="white" stroke="white" />
          ) : (
            <Bookmark stroke="white" />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 text-sm text-gray-300 flex justify-between">
        <div className="flex gap-4 font-medium">
          <span>{likeCount} likes</span>
          <span>{comments.length} comments</span>
          <span>{shareCount} shares</span>
        </div>
        <div className="flex gap-4 font-medium">
          <span>{saveCount} saves</span>
        </div>
      </div>

      <div className="px-4 text-sm mt-1 text-gray-300">
        <Link href={`/${post.createdBy.username}`}>
          <b>{post.createdBy.username}</b>
        </Link>{" "}
        {post.description || "No description"}
      </div>

      <div className="px-4 mt-2 space-y-1 text-sm text-gray-300">
        {comments.slice(0, totalComments).map((comment) => (
          <div key={comment._id}>
            <b>{comment.createdBy.username}: </b>
            {comment.text}
          </div>
        ))}

        {comments.length > totalComments && !showAllComments && (
          <div
            onClick={() => setShowAllComments(true)}
            className="text-gray-500 text-sm hover:underline cursor-pointer"
          >
            View all {comments.length} comments
          </div>
        )}
      </div>

      <div className="flex items-center border-stone-800 mt-3 px-4 py-3 border-b">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 resize-none text-sm bg-black text-white placeholder-gray-500 focus:outline-none"
          rows={1}
        />
        {text.length > 0 && (
          <div
            onClick={handleSubmitComment}
            className="text-stone-400 font-semibold text-sm cursor-pointer hover:text-white"
          >
            Post
          </div>
        )}
      </div>

      {showAllComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-stone-900/90 max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg p-4 flex flex-col md:flex-row gap-x-3">

            <div className="w-full flex justify-center items-center">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              ) : (
                <div className="text-gray-500 p-4">
                  nothing to show you buddy
                </div>
              )}
            </div>

            <div className="md:w-1/2 w-full flex flex-col">

              <div className="flex items-center gap-2 text-sm text-gray-300 mb-3 px-2 py-1 border-b border-stone-700">
                <Image
                  src={post.createdBy.profilePicture || "/default-avatar.png"}
                  alt={post.createdBy.username}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <Link href={`/${post.createdBy.username}`}>
                    <span className="font-semibold hover:underline">
                      {post.createdBy.username}
                    </span>
                  </Link>
                  <div className="text-gray-500 text-xs">
                    {dayjs(post.createdAt).fromNow()}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-2 items-start">
                    <Image
                      src={
                        comment.createdBy.profilePicture ||
                        "/default-avatar.png"
                      }
                      alt={comment.createdBy.username}
                      width={32}
                      height={32}
                      className="rounded-full object-cover mt-1"
                    />
                    <div className="text-gray-300 text-sm">
                      <div className="flex gap-2 items-center">
                        <b>{comment.createdBy.username}</b>
                        <span className="text-gray-500 text-xs">
                          {dayjs(comment.createdAt).fromNow()}
                        </span>
                      </div>
                      <div>{comment.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-2 py-2 border-t border-stone-700 flex justify-between">
                <div className="flex items-center border-stone-800 px-4 py-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 resize-none text-sm text-white placeholder-gray-500 focus:outline-none"
                    rows={1}
                  />
                  {text.length > 0 && (
                    <div
                      onClick={handleSubmitComment}
                      className="text-stone-400 font-semibold text-sm cursor-pointer hover:text-white"
                    >
                      Post
                    </div>
                  )}
                </div>
                <button
                  className="text-gray-400 flex flex-col justify-center hover:text-white font-medium cursor-pointer"
                  onClick={() => setShowAllComments(false)}
                >
                  <X />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
