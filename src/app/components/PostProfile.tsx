import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, Send, MessageCircle, Bookmark } from "lucide-react";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";
dayjs.extend(relativeTime);

export const PostProfile = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const [isShared, setIsShared] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares.length);

  const axios = useAxios();

  const [text, setText] = useState("");
  const [comments, setComments] = useState(post.comments);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userId = user._id;
      setIsLiked(post.likes.some((like) => like.createdBy._id === userId));
      setIsShared(post.shares.some((share) => share.createdBy._id === userId))
    }
  }, [user]);

  const handleSubmitComment = async () => {
    const response = await axios.post(`/posts/${post._id}/comments`, { text });

    if (response.status === 200) {
      setText("");
      setComments([...comments, response.data]);
    } else {
      toast.error("Алдаа гарлаа");
    }
  };

  return (
    <div key={post._id} className="mb-8 text-white">

  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <div className="text-gray-500">{dayjs(post.createdAt).fromNow()}</div>
    </div>
  </div>

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

  <div className="px-4 text-sm text-gray-300">
    <div className="flex gap-4 font-medium">
      <span>{likeCount} likes</span>
      <span>{comments.length} comments</span>
      <span>{shareCount ?? 0} shares</span>
    </div>
  </div>
</div>

  );
};

