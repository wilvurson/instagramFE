"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "../providers/UserProvider";
import { redirect } from "next/navigation";

const SingInPage = () => {
  const { user, setToken } = useContext(UserContext);

  const [passwordShown, setPasswordShown] = useState(false);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return redirect("/");
  }

  const handleSignin = async () => {
    const response = await fetch("https://instagram-be-seven.vercel.app/signin", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ credential, password }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      setToken(data.body);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
          <img src="https://instaproapp.tools/wp-content/uploads/2025/07/insta-pro.png" alt="pic" />
      <div className="flex flex-col items-center mb-6">
        <div>
          <img
            className="h-40"
            src="https://download.logo.wine/logo/Instagram/Instagram-Wordmark-Black-Logo.wine.png"
            alt="logo"
          />
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter your email, phone or username..."
              value={credential}
              onChange={(e) => {
                setCredential(e.target.value);
              }}
            />
            <div className="relative">
              <Input
                placeholder="Password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={passwordShown ? "text" : "password"}
              />
              <Button
                onClick={() => {
                  setPasswordShown(!passwordShown);
                }}
                variant="ghost"
                className="absolute right-0 top-0"
              >
                {passwordShown ? <Eye /> : <EyeClosed />}
              </Button>
            </div>
            <Button className="bg-blue-700" onClick={handleSignin}>login</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingInPage;
