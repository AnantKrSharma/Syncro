import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){   
    try {
        const session = await getServerSession(NEXT_AUTH);
        if(!session?.user?.id){
            return NextResponse.json({
                error: "Unauthenticated"
            })
        }

        const mostUpvotedStream = await prismaClient.stream.findFirst({  //finding the most upvoted stream
            where: {
                userId: session?.user?.id,
                played: false
            },
            orderBy: {
                upvotes: {
                    _count: "desc"
                }
            }
        })

        const current = await prismaClient.currentStream.upsert({  //creating a new 'current-stream' for the user, or updating if it already exists for a particular user
            where: {
                userId: session?.user?.id
            },
            update: {
                streamId: mostUpvotedStream?.id
            },
            create: {
                userId: session?.user?.id,
                streamId: mostUpvotedStream?.id
            },
            include: {
                stream: true
            }
        })

        await prismaClient.stream.update({  //updating the 'played' field to true for the most upvoted stream
                where: {
                    id: mostUpvotedStream?.id
                },
                data: {
                    played: true
                }
            })

        return NextResponse.json({
            message: "Current stream updated",
            current
    });    
    } catch (error: any) {
        return NextResponse.json({
            error: "Error while updating current stream"
        })
    }
}
