import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { spotifyRegex, youtubeRegex } from "@/app/lib/regex";
import youtubesearchapi from 'youtube-search-api';
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/app/lib/auth";
import fetchVideoInfo from 'updated-youtube-info';

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string().url().refine((url) => {
        return youtubeRegex.test(url) || spotifyRegex.test(url);
    })
})


//create new stream inside a creator's/user's space
export async function POST(req: NextRequest){
    try{
        const session = await getServerSession(NEXT_AUTH);
        if(!session?.user?.id){
            return NextResponse.json({
                error: "Unauthenticated"
            })
        }

        const body = await req.json();

        const parsedBody = CreateStreamSchema.safeParse(body);  //check body input
        if(!parsedBody.success){
            return NextResponse.json({
                error: "Incorrect inputs"
            })
        }

        if(session?.user?.id != body.creatorId){  //check if the stream-adder and the space owner are the same  
            const activeStreams = await prismaClient.stream.findMany({  //check if the stream-adder has added 3 streams already in the user's space
                where: {                          
                    userId: body.creatorId,
                    addedById: session?.user?.id
                }
            });

            if(activeStreams.length >= 3){
                return NextResponse.json({
                    error: "Can't add more than 3 streams in other user's space"
                });
            }
        }

        const url = new URL(body.url);
        const extractedId = url.searchParams.get("v");
        if (!extractedId) {
            return NextResponse.json({
                error: "Invalid YouTube URL"
            });
        }

        //fetch the details of the YouTube video - title, thumbnail, etc
        // const video = await youtubesearchapi.GetVideoDetails(extractedId).catch(err => {
        //     console.error("YouTube API Error in Production:", err.message);
        //     return null;
        // });
        // let thumbnails = video.thumbnail.thumbnails;
        // thumbnails.sort( (a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1 );  //arrange in ascending order
        const video = await fetchVideoInfo(extractedId);
        if (!video) {
            return NextResponse.json({
                error: "Failed to fetch video details",
            });
        }
        console.log("Video Details Response in Production:", video);
        
        const newStream = await prismaClient.stream.create({  //create new stream
            data: {
                userId: body.creatorId,
                addedById: session?.user?.id,
                url: body.url,
                extractedID: extractedId,
                type: "YouTube",
                title: video.title ?? "Stream not found",
                // largeThumbnail: thumbnails[thumbnails.length - 1].url ?? "https://e7.pngegg.com/pngimages/829/733/png-clipart-logo-brand-product-trademark-font-not-found-logo-brand.png",
                // smallThumbnail: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://e7.pngegg.com/pngimages/829/733/png-clipart-logo-brand-product-trademark-font-not-found-logo-brand.png"
                largeThumbnail: video?.thumbnailUrl,
                smallThumbnail: video?.thumbnailUrl
            }
        })

        return NextResponse.json({
            message: "New stream created",
            streamId: newStream.id
        })
    }
    catch(err){
        console.log(err.message);
        
        return NextResponse.json({
            error: "Error while creating a new stream.",
            err: err.message
        });
    }
}


//get all streams for a particular creator/user
export async function GET(req: NextRequest){
    try {
        const session = await getServerSession(NEXT_AUTH);  //get the logged-in user details
        if(!session?.user?.email){
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const creatorId = req.nextUrl.searchParams.get('creatorId');  //get the creator's id
        if(!creatorId){
            return NextResponse.json({
                error: "Creator not found"
            })
        }

        const allStreams = await prismaClient.stream.findMany({  //fetch all the streams of the creator/user, which haven't been played yet
            where: {
                userId: creatorId,
                played: false
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

        const currentStream = await prismaClient.currentStream.findFirst({  //find the current stream of the user
            where: {
                userId: creatorId
            },
            include: {
                stream: true
            }
        })

        if(allStreams.length == 0){
            return NextResponse.json({
                allStreams: [],
                currentStream: currentStream ?? null
            })
        }
        
        return NextResponse.json({
            allStreams: allStreams.map( ({ _count, ...otherKeys }) => 
                ({ ...otherKeys,
                    upvoteCount: _count.upvotes,
                    haveUpvoted: (otherKeys.upvotes.length > 0) ? true : false
                }) ),
            currentStream
        })

    } catch (error) {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({
            error: "Error while fetching streams"
        })
    }
}
