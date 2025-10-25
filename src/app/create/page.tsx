"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "../providers/UserProvider";
import Image from "next/image";
import { useAxios } from "../hooks/useAxios";

const Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const axios = useAxios();
  const router = useRouter();
  const { token } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setUploading(true);

      // Upload image to Vercel Blob
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { url: imageUrl } = await uploadResponse.json();

      // Create post with the uploaded image URL
      const response = await axios.post("/posts", { imageUrl, description });

      console.log(response);

      toast.success("Post created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-[600px] mx-auto">
      <div className="h-11 flex justify-between items-center border-b">
        <Link href={"/"}>
          <ChevronLeft size={24} />
        </Link>
        <div className="font-bold">New post</div>
        <Button onClick={handleSubmit} className="font-bold text-blue-400" variant={"ghost"} disabled={uploading || !selectedFile}>
          {uploading ? "Uploading..." : "Share"}
        </Button>
      </div>
      <div className="py-4 flex flex-col gap-4">
        {/* File input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="file-upload"
            className="cursor-pointer border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center hover:border-blue-400 transition-colors"
          >
            {previewUrl ? (
              <div className="relative w-full aspect-square">
                <Image src={previewUrl} alt="Preview" fill className="object-contain rounded-lg" />
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload image</span>
              </>
            )}
          </label>
          <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." />
      </div>
    </div>
  );
};

export default Page;