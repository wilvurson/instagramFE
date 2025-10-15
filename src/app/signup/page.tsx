"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SingUpPage = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async () => {
    const response = await fetch("http://localhost:5500/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ credential, password, fullname, username }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter your email, phone..."
              value={credential}
              onChange={(e) => {
                setCredential(e.target.value);
              }}
            />
            <Input
              placeholder="Fullname..."
              value={fullname}
              onChange={(e) => {
                setFullname(e.target.value);
              }}
            />
            <Input
              placeholder="Username..."
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
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
            <Button onClick={handleSignup}>Sign up</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingUpPage;