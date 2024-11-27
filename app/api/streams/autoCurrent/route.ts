import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const session = await getServerSession(NEXT_AUTH);  //authentication
        if(!session?.user?.id){
            return NextResponse.json({
                error: "Unauthorized"
            });
        }
        
        const creatorId = req.nextUrl.searchParams.get('creatorId');  //fetching the creator-id
        if(!creatorId){
            return NextResponse.json({
                error: "No creator found"
            });
        }

        const mostUpvotedStream = await prismaClient.stream.findFirst({  //get the most upvoted stream of the creator
            where: {
                userId: creatorId,
                played: false
            },
            orderBy: {
                upvotes: {
                    _count: "desc"
                }
            }
        });

        const current = await prismaClient.currentStream.upsert({  //insert it in the currentStream table as the current stream for that creator
            where: {
                userId: creatorId
            },
            update: {
                streamId: mostUpvotedStream?.id
            },
            create: {
                userId: creatorId,
                streamId: mostUpvotedStream?.id
            },
            include: {
                stream: true
            }
        });

        await prismaClient.stream.update({
            where: {
                id: mostUpvotedStream?.id
            },
            data: {
                played: true
            }
        });

        return NextResponse.json({
            message: "Current stream updated",
            current
        })
    }catch(error){
        // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({
            error: "Error while updating current stream"
        });
    }
}
