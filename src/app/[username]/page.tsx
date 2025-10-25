"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User } from "../types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Grid, UserSquare2, Check } from "lucide-react";
import { Navbar } from "../components/Navbar";

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get(`/users/${username}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err?.response?.status === 404) setIsNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading)
    return <div className="text-center text-2xl mt-8 text-white">Loading...</div>;

  if (isNotFound)
    return (
      <div className="text-center text-2xl mt-8 text-white">
        404 user not found
      </div>
    );

  return (
    
    <div className="min-h-screen bg-black text-white w-full">
      < Navbar/>
      <div className="w-full flex justify-center pt-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-10 mb-8">
          {/* Profile picture */}
          <div className="flex justify-center md:block mb-6 md:mb-0">
            <img
              src={"/default-avatar.png"}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border border-gray-700"
            />
          </div>
          


          <div className="flex-1 text-center md:text-left">

            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <h1 className="text-2xl font-semibold">{user?.username}</h1>

              < Check />
              
              <button className="p-2 hover:bg-[#262626] rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 mb-4 text-sm">
              <span>
                0 posts
              </span>
              <span>
                0 followers
              </span>
              <span>
                0 following
              </span>
            </div>

            {/* Bio */}
            <div className="text-sm leading-snug mb-4">
              <span className="font-semibold block">{user?.fullname || "User"}</span>
              <p className="text-gray-300">{"No bio yet."}</p>
              
            </div>
            


          </div>
          
        </div>
        
      </div>
            <div className="flex m-full justify-center gap-2">
              <Button className="bg-[#0051ff] text-white text-sm font-semibold w-50 h-10 px-6 hover:bg-[#1839f2]">
                Follow
              </Button>
              <Button className="bg-[#262626] text-white text-sm font-semibold w-50 h-10 px-6 hover:bg-[#363636]">
                Message
              </Button>
              <Button className="bg-[#262626] text-white text-sm font-semibold px-4 h-10 hover:bg-[#363636]">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
    </div>
    
  );
};

export default ProfilePage;
