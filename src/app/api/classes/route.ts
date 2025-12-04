import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { classes } from "@/lib/data";

export const GET = async () => {
  const Classes = classes;

  return NextResponse.json(Classes);
};

export const POST = async (req: NextRequest) => {
  try {
    const requestData = await req.json();

    const newClass = {
      name: requestData.name,
      _id: nanoid(),
    };

    classes.push(newClass);

    return NextResponse.json({ status: 202, data: newClass });
  } catch (err) {
    console.log("error", err);

    return NextResponse.json({ status: 500, message: "error" });
  }
};

export const PUT = async (req: NextRequest) => {
  try {

    const { id, name } = await req.json();
    const selectedClass = classes.findIndex((i) => i._id == id)

    const updatedClass = {
      name: name,
      _id: id,
    };

  } catch (err) {
    console.log("error", err);

    return NextResponse.json({ status: 500, message: "error" });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    
    const { id } = await req.json()
    const selected = classes.findIndex((i) => i._id == id)

  } catch (err) {
    console.log(err);

    return NextResponse.json({ status: 500, message: "error" });
  }
};
