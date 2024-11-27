import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DownvoteSchema = z.object({
    streamId: z.string()
})

//downvote a stream
export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(NEXT_AUTH);  //get user session
        if(!session?.user?.email){
            return NextResponse.json({
                error: "Unauthenticated"
            })
        }

        const user = await prismaClient.user.findFirst({  //fetch user from db
            where: {
                email: session?.user?.email
            }
        })
        if(!user){
            return NextResponse.json({
                error: "Unauthenticated"
            })
        }

        const body = await req.json();
        
        const parsedBody = DownvoteSchema.safeParse(body);  //check body input
        if(!parsedBody.success){
            return NextResponse.json({
                error: "Invalid inputs"
            })
        }

        const upvote = await prismaClient.upvote.findUnique({  //check if upvote exists
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: body.streamId
                }
            }
        })
        if(!upvote){
            return NextResponse.json({
                error: "Downvoted succesfully"
            })
        }

        await prismaClient.upvote.delete({  //deleting the upvote
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: body.streamId
                }
            }
        })

        return NextResponse.json({
            message: "Downvoted succesfully"
        })

    } catch (error) {
        return NextResponse.json({
            error: "Error while downvoting"
        })
    }
}
