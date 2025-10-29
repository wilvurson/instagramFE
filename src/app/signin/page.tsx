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
    const response = await fetch("http://localhost:5500/signin", {
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
    <div className="w-full h-screen flex justify-center items-center bg-stone-900">
      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-col border-stone-700 bg-black rounded-2xl justify-between p-5 w-70 h-120">
          <div className="flex justify-center w-full">
            <img
            className="h-30 w-40 flex fle"
            src="https://image.similarpng.com/file/similarpng/original-picture/2020/06/Instagram-name-logo-transparent-PNG.png"
            alt="logo"
          />
          </div>
          
          <div className="flex flex-col gap-4 mb-50">
            <Input
              placeholder="Enter your email..."
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
            <Button className="bg-blue-700 mt-10" onClick={handleSignin}>login</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingInPage;
