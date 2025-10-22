"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User } from "../types";

const Page = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get(`/users/${username}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((res) => {
        if (res.status === 404) {
          setIsNotFound(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="text-center text-2xl mt-8">Loading...</div>
  );
  if (isNotFound) return (
    <div className="text-center text-2xl mt-8">404 user not found</div>
  )

  return (
  <div className="flex w-full justify-center gap-x-10 items-center mt-8">
    <div>
        <img
            alt=""
            className="w-32 h-32 rounded-full object-cover bg-gray-200"
        />
    </div>
    <div>
        <div className="text-2xl font-bold mb-4">{user?.fullname}</div>
        <div className="grid grid-cols-3 gap-4">{user?.username}</div>
        <div className="flex gap-x-5">
            <div>posts</div>
            <div>followers</div>
            <div>following</div>
        </div>
    </div>
  </div>
  );
};

export default Page;