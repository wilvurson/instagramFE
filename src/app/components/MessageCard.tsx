"use client";

import { Message, MessageComment } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  X,
  MoreHorizontal,
  Trash2,
  BadgeCheck,
} from "lucide-react";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";
import Image from "next/image";

dayjs.extend(relativeTime);

export const MessageCard = ({
  message,
  onDelete,
}: {
  message: Message;
  onDelete?: (id: string) => void;
}) => {
  const [totalComments] = useState(1);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] =
    useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const axios = useAxios();
  const { user } = useUser();

  const [text, setText] = useState("");
  const [comments, setComments] = useState<MessageComment[]>(
    message.comments || []
  );

  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAllComments) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showAllComments]);

  const handleSubmitComment = async () => {
    if (!text.trim()) return;
    try {
      const response = await axios.post(`/messages/${message._id}/comments`, {
        text,
      });
      if (response.status === 200) {
        setText("");
        setComments([...comments, response.data]);
      }
    } catch {
      toast.error("Error posting comment");
    }
  };

  const handleDeleteMessage = async () => {
    try {
      const response = await axios.delete(`/messages/${message._id}`);
      if (response.status === 200) {
        toast.success("Message deleted successfully");
        if (onDelete) onDelete(message._id);
        window.location.reload();
      }
    } catch {
      toast.error("Failed to delete message");
    }
    setShowDeleteConfirm(false);
    setShowOptions(false);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      const response = await axios.delete(
        `/messages/${message._id}/comments/${commentToDelete}`
      );
      if (response.status === 200) {
        setComments(comments.filter((c) => c._id !== commentToDelete));
        toast.success("Comment deleted");
      }
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setShowDeleteCommentConfirm(false);
      setCommentToDelete(null);
    }
  };

  const renderUsernameWithBadge = (u: any) => (
    <div className="flex gap-1 items-center">
      <b>{u.username}</b>
      <span className="flex items-center gap-1">
        {u.username === "wilvurson" && (
          <>
            <BadgeCheck className="w-4 h-4 blue-glow" />
            <Heart className="w-4 h-4 blue-cyan-glow" />
          </>
        )}
        {u.username === "elvur" && (
          <>
            <BadgeCheck className="w-4 h-4 blue-glow" />
            <Heart className="w-4 h-4 blue-cyan-glow" />
          </>
        )}
        {u.username !== "wilvurson" &&
          u.username !== "elvur" &&
          u.followers &&
          u.followers.length >= 10 && (
            <BadgeCheck className="w-4 h-4 blue-glow" />
          )}
      </span>
    </div>
  );

  return (
    <div
      key={message._id}
      className="flex gap-3 text-white bg-black p-3 overflow-hidden cursor-default"
    >
      <Image
        src={message.createdBy.profilePicture || "/default-avatar.png"}
        alt=""
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm text-stone-300 mb-1">
          <Link
            href={`/${message.createdBy.username}`}
            className="hover:underline font-medium"
          >
            {renderUsernameWithBadge(message.createdBy)}
          </Link>
          <div className="text-stone-500 text-xs">
            {dayjs(message.createdAt).fromNow()}
          </div>
          {user && user._id === message.createdBy._id && (
            <div className="relative ml-auto" ref={optionsRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-stone-400 hover:text-white cursor-pointer transition"
              >
                <MoreHorizontal size={16} />
              </button>

              {showOptions && (
                <div className="absolute right-0 top-6 bg-[#1c1c1c] border border-stone-700 rounded-md shadow-md w-36 z-50">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center justify-center gap-2 w-full text-left text-stone-400 hover:text-white cursor-pointer px-3 py-2 text-sm"
                  >
                    <Trash2 size={16} /> Delete Message
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-stone-300 break-words">{message.text}</div>

        {comments.length > 0 && (
          <div className="text-sm mt-2 text-stone-300">
            <div className="overflow-y-auto space-y-2 max-h-[120px]">
              {comments.slice(0, totalComments).map((comment) => (
                <div key={comment._id} className="flex gap-2 items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src={
                        comment.createdBy.profilePicture ||
                        "/default-avatar.png"
                      }
                      alt={comment.createdBy.username}
                      width={25}
                      height={25}
                      className="rounded-full object-cover w-7 h-7"
                    />
                  </div>
                  <div className="flex-1 text-stone-300 text-sm break-words">
                    <Link
                      href={`/${comment.createdBy.username}`}
                      className="hover:underline"
                    >
                      {renderUsernameWithBadge(comment.createdBy)}
                    </Link>
                    <div>{comment.text}</div>
                  </div>

                  {user && user._id === comment.createdBy._id && (
                    <Trash2
                      className="w-4 h-4 text-stone-500 hover:text-white cursor-pointer"
                      onClick={() => {
                        setCommentToDelete(comment._id);
                        setShowDeleteCommentConfirm(true);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {comments.length > totalComments && !showAllComments && (
              <div
                onClick={() => setShowAllComments(true)}
                className="text-stone-500 text-sm hover:underline cursor-pointer mt-1"
              >
                View all {comments.length} comments
              </div>
            )}
          </div>
        )}
      </div>

      {showAllComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2">
          <div className="bg-[#161616] w-full max-w-md md:max-w-3xl max-h-[90vh] overflow-hidden rounded-lg flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex gap-3 text-stone-300 mb-4">
                <Image
                  src={
                    message.createdBy.profilePicture || "/default-avatar.png"
                  }
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-stone-300 mb-1">
                    <Link
                      href={`/${message.createdBy.username}`}
                      className="hover:underline font-medium"
                    >
                      {renderUsernameWithBadge(message.createdBy)}
                    </Link>
                    <div className="text-stone-500 text-xs">
                      {dayjs(message.createdAt).fromNow()}
                    </div>
                  </div>
                  <div className="break-words">{message.text}</div>
                </div>
              </div>
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-2 items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src={
                        comment.createdBy.profilePicture ||
                        "/default-avatar.png"
                      }
                      alt={comment.createdBy.username}
                      width={32}
                      height={32}
                      className="rounded-full object-cover mt-1 w-7 h-7"
                    />
                  </div>
                  <div className="flex-1 text-stone-300 text-sm break-words">
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/${comment.createdBy.username}`}
                        className="hover:underline"
                      >
                        {renderUsernameWithBadge(comment.createdBy)}
                      </Link>
                      <span className="text-stone-500 text-xs">
                        {dayjs(comment.createdAt).fromNow()}
                      </span>
                    </div>
                    <div>{comment.text}</div>
                  </div>

                  {user && user._id === comment.createdBy._id && (
                    <Trash2
                      className="w-4 h-4 text-stone-500 hover:text-white cursor-pointer mt-1"
                      onClick={() => {
                        setCommentToDelete(comment._id);
                        setShowDeleteCommentConfirm(true);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-stone-700 flex justify-end">
              <button
                className="text-stone-400 hover:text-white cursor-pointer"
                onClick={() => setShowAllComments(false)}
              >
                <X />
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#161616] rounded-lg p-6 w-80 flex flex-col gap-4">
            <div className="text-stone-300 text-center text-sm">
              Delete this message?
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleDeleteMessage}
                className="flex-1 bg-white hover:bg-stone-300 text-black py-2 rounded font-semibold cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-stone-700 hover:bg-stone-600 text-white py-2 rounded font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteCommentConfirm && commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#161616] rounded-lg p-6 w-80 flex flex-col gap-4">
            <div className="text-stone-300 text-sm border-b border-stone-700 pb-2">
              {comments
                .filter((e) => e._id === commentToDelete)
                .map((comment) => (
                  <div key={comment._id} className="flex gap-2 items-start">
                    <div className="flex-shrink-0">
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
                    </div>
                    <div className="flex-1 text-stone-300 text-sm break-words">
                      {renderUsernameWithBadge(comment.createdBy)}
                      <div>{comment.text}</div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={handleDeleteComment}
                className="flex-1 bg-white hover:bg-stone-300 text-black py-2 rounded font-semibold cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteCommentConfirm(false)}
                className="flex-1 bg-stone-700 hover:bg-stone-600 text-white py-2 rounded font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
