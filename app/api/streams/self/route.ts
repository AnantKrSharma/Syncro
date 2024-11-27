import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const session = await getServerSession(NEXT_AUTH);  //get the logged-in user details
        if(!session?.user?.email){
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const allStreams = await prismaClient.stream.findMany({  //find all the streams for the logged-in user
            where: {
                userId: session?.user?.id
            },
            include: {
                _count: {
                    select: {
                        upvotes: true
                    }
                },
                upvotes: {
                    where: {
                        userId: session?.user?.id
                    }
                }
            }
        })
        if(allStreams.length == 0){
            return NextResponse.json({
                allStreams: []
            })
        }

        return NextResponse.json({
            allStreams: allStreams.map( ({ _count, ...otherKeys }) => 
                ({ ...otherKeys, 
                    upvoteCount: _count.upvotes, 
                    haveUpvoted: (otherKeys.upvotes.length > 0) ? true : false
                }) )
        });
    } catch (error) {
        return NextResponse.json({
            error: "Error while fetching streams"
        })
    }
}
