"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useUser } from "../../providers/UserProvider";
import { useAxios } from "../../hooks/useAxios";
import Link from "next/link";

const EditProfilePage = () => {
  const { user: currentUser } = useUser();
  const axios = useAxios();
  const router = useRouter();

  const [username, setUsername] = useState<string>(currentUser?.username || "");
  const [fullname, setFullname] = useState<string>(currentUser?.fullname || "");
  const [bio, setBio] = useState<string>(currentUser?.bio || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    currentUser?.profilePicture || ""
  );
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setPreviewUrl(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!currentUser) return;

    try {
      setUploading(true);
      let profilePictureUrl = previewUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/file", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload profile picture");

        const data: { url: string } = await uploadRes.json();
        profilePictureUrl = data.url;
      }

      await axios.patch("/users/me", {
        username,
        fullname,
        bio,
        profilePicture: profilePictureUrl,
      });

      toast.success("Profile updated successfully!");
      router.push(`/${currentUser.username}`);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Profile</h1>

      <label
        htmlFor="file-upload"
        className="cursor-pointer flex justify-center mb-6"
      >
        <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-700">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              fill
              className="object-cover"
            />
          ) : (
            <Upload className="w-12 h-12 text-stone-400 m-auto mt-10" />
          )}
        </div>
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <div className="mb-4 flex flex-col gap-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-2 border-stone-600"
        />
        <Input
          placeholder="Fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="border-2 border-stone-600"
        />
        <Input
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border-2 border-stone-600"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full mt-5 cursor-pointer bg-white text-black hover:bg-stone-200"
      >
        Save Changes
      </Button>

      <Link href={`/${currentUser?.username || ""}`}>
        <Button className="w-full mt-5 cursor-pointer bg-[#262626] text-white hover:bg-[#363636]">Go Back</Button>
      </Link>
    </div>
  );
};

export default EditProfilePage;
