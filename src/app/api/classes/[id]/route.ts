import { NextRequest, NextResponse } from "next/server"
import { classes } from "@/lib/data"

export const GET = async (req: NextRequest,
    { params } : { params : Promise<{ _id: string}> }
) => {
    try {
        const { _id } = await params;

        const data = classes?.filter((item) => item._id == _id);
        return NextResponse.json(data)
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: err}, {status: 500})
    }
}