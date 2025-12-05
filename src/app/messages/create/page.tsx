"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "../../providers/UserProvider";
import { useAxios } from "../../hooks/useAxios";

const Page = () => {
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const axios = useAxios();
  const router = useRouter();
  const { token } = useUser();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setPosting(true);

      const response = await axios.post("/messages", { text });

      console.log(response);

      toast.success("Message posted successfully!");
      router.push("/messages");
    } catch (error) {
      console.error("Error creating message:", error);
      toast.error("Failed to post message");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 sm:px-0">
      <div className="h-11 flex justify-between items-center border-b">
        <Link href={"/messages"}>
          <ChevronLeft size={24} />
        </Link>
        <div className="font-bold">New Message</div>
        <Button
          onClick={handleSubmit}
          className="font-bold text-blue-400"
          variant={"ghost"}
          disabled={posting || !text.trim()}
        >
          {posting ? "Posting..." : "Post"}
        </Button>
      </div>

      <div className="py-4 flex flex-col gap-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="resize-none min-h-[200px]"
        />
      </div>
    </div>
  );
};

export default Page;
