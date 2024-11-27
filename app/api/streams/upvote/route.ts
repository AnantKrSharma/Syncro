import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
})

//upvote a stream
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

        const parsedBody = UpvoteSchema.safeParse(body);  //check body input
        if(!parsedBody.success){
            return NextResponse.json({
                error: "Invalid inputs"
            })
        }

        const exists = await prismaClient.upvote.findUnique({
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: body.streamId
                }
            }
        })

        if(!exists){
            await prismaClient.upvote.create({  //create upvote
                data: {
                    userId: user.id,
                    streamId: body.streamId
                }
            })

            return NextResponse.json({
                message: "Upvoted succesfully",
            })
        }
        else{
            return NextResponse.json({
                error: "Already upvoted"
            })  
        }

    } catch (error) {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({
            error: "Error while upvoting"
        })
    }
}
