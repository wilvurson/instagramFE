"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "../providers/UserProvider";

const Page = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const {token} = useContext(UserContext)

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5500/posts", {
      method: "POST",
      body: JSON.stringify({ imageUrl, description }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (response.status !== 200) {
      toast.error(data.message);
      return;
    }

    toast.success("Post created successfully!");
    router.push("/");
  };

  return (
    <div className="w-[600px] mx-auto">
      <div className="h-11 flex justify-between items-center border-b">
        <Link href={"/"}>
          <ChevronLeft size={24} />
        </Link>
   <div className="font-bold">New post</div>
        <Button onClick={handleSubmit} className="font-bold text-blue-400" variant={"ghost"}>
          Share
        </Button>
      </div>
      <div className="py-4 flex flex-col gap-4">
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image url..." />
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." />
      </div>
    </div>
  );
};

export default Page;