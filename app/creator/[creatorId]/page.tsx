'use client';

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, ArrowUp, ArrowDown, Share2 } from 'lucide-react'
import { AppBar } from '../../components/AppBar'
import axios from 'axios';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import Skeleton from '../../components/Skeleton';
import { youtubeRegex } from '../../lib/regex';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import Redirect from '@/app/components/Redirect';
import YouTubePlayer from 'youtube-player';

interface Stream {
    id: number,
    userId: string,
    url: string,
    extractedID: string,
    title: string,
    smallThumbnail: string,
    largeThumbnail: string,
    active: boolean,
    played: boolean,
    timestamp: Date,
    createdAt: Date,
    upvotes: number,
    upvoteCount: number,
    haveUpvoted: boolean
}

const REFRESH_INTERVAL = 10 * 1000;

export default function Creator() {
    const [newStreamUrl, setNewStreamUrl] = useState('');
    const [streams, setStreams] = useState<Stream[]>([]);
    const [streamLoading, setStreamLoading] = useState(false);
    const [newStreamLoading, setNewStreamLoading] = useState(false);
    const [ytPreview, setYtPreview] = useState(false);
    const [currentStream, setCurrentStream] = useState<Stream>();
    const params = useParams();
    const { data } = useSession();
    const session = useSession();
    const router = useRouter();
    const streamRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    
    async function getStreams(){
        //@ts-expect-error: Id field is added
        if(!data?.user?.id){
            return;
        }
        try {
            setStreamLoading(true);

            const res = await axios.get(`/api/streams?creatorId=${params.creatorId}`);        
            if(res.data.error){
                throw new Error(res.data.error)
            }

            setStreams(res.data.allStreams.sort((a: Stream, b: Stream) => b.upvoteCount - a.upvoteCount));
            setCurrentStream(res.data.currentStream.stream);
            setYtPreview(true);
        } catch (error) {
            // eslint-disable-line @typescript-eslint/no-unused-vars
            toast.error(`Error while loading streams`, {
                position: "bottom-right",
                autoClose: 2100,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
        finally{
            setStreamLoading(false);
        }
    }

    async function createStream(){
        try {
            setNewStreamLoading(true);
            
            const res = await axios.post('/api/streams', {
                creatorId: params.creatorId,
                url: newStreamUrl
            });
            if(res.data.error){
                throw new Error(res.data.error);
            }
            if(res.data.message){
                toast.success(`${res.data.message}`, {
                    position: "bottom-right",
                    autoClose: 2100,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            }

            setNewStreamUrl('');
            getStreams();
        } catch (error) {
            //@ts-expect-error: error.message is used
            toast.error(`${error.message ?? "Error while creating a new stream"}`, {
                position: "bottom-right",
                autoClose: 2100,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
        finally{
            setNewStreamLoading(false);
        }
    }

    useEffect(() => {
        //@ts-expect-error: Id field is added
        if(data?.user?.id == params.creatorId){
            router.push('/dashboard');
        }
        getStreams();
        
        const interval = setInterval( () => { 
        
        }, REFRESH_INTERVAL )
        //@ts-expect-error: Id field is added
    }, [data?.user?.id])

    useEffect(() => {
        if(!streamRef.current){
            return;
        }
        const player = YouTubePlayer(streamRef.current);

        player.loadVideoById(currentStream?.extractedID || '');

        player.playVideo();
        
        player.on('stateChange', (event) => {
            if(event.data == 0){
                player.stopVideo();
                autoNextStream();
                setIsPlaying(false);
            }
            else if(event.data == 1){
                setIsPlaying(true);
            }
        })
        
        return () => {
            player.destroy();
        }
    }, [currentStream?.id]);

    async function vote(id: number, vote: string){
        try { 
            const res = await axios.post(`/api/streams/${vote}`, {
                streamId: id
            });  
            if(res.data.error){
                throw new Error(res.data.error);
            }
            if(res.data.message){
                toast.success(`${res.data.message}`, {
                    position: "bottom-right",
                    autoClose: 2100,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            }
            
            getStreams();
        } catch (error) {
            const message = vote == "upvote" ? "Upvoting" : "Downvoting";
            //@ts-expect-error: error.message is used
            toast.error(`${error.message ?? `Error while ${message}`}`, {
                position: "bottom-right",
                autoClose: 2100,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
    }

    async function handleShare(){
        const shareAbleLink = window.location.href;

        await navigator.clipboard.writeText(shareAbleLink);
        toast.success("Link copied succesfully", {
            position: "bottom-right",
            autoClose: 2100,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });
    }

    async function autoNextStream(){
        try {
            const res = await axios.get(`/api/streams/autoCurrent?creatorId=${params.creatorId}`);
            getStreams();

        } catch (error) {
            // eslint-disable-line @typescript-eslint/no-unused-vars
            toast.error(`Error while changing stream`, {
                position: "bottom-right",
                autoClose: 2100,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
    }

    return (
    <div className="flex h-screen overflow-auto flex-col bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950">
        <Redirect />

        <div>
            <AppBar page='creator'/>   
        </div>

        <main className="md:flex-grow md:flex md:justify-center md:gap-10 overflow-auto p-4">
            {/* Add new Stream and Stream-Preview section */}
            <section className="w-1/3 self-start flex flex-col items-center gap-4">
                <div className='bg-zinc-700 bg-opacity-25 backdrop-blur-3xl p-6 rounded-2xl w-full'>
                    <h2 className="text-xl font-semibold mb-4 text-white">Add New Stream</h2>
                    <div className='flex flex-grow gap-2'>
                        <div className='flex flex-col justify-center flex-1'>
                            <div className="space-y-4 flex flex-col justify-center items-center">
                                <Input className="bg-white bg-opacity-10 text-white placeholder-gray-400 border-gray-600"
                                        type="text"
                                        placeholder="Enter YouTube or Spotify URL"
                                        value={newStreamUrl}
                                        onChange={(e) => setNewStreamUrl(e.target.value)}
                                        />
                                <Button className="w-auto bg-white bg-opacity-20 hover:bg-gray-800 text-white" 
                                        onClick={createStream}
                                        disabled={newStreamLoading}
                                        >
                                    {newStreamLoading 
                                        ? 
                                        <span className="loading loading-infinity loading-md"/> 
                                        :
                                        <span className='flex items-center text-sm md:text-base'>
                                            Add to Queue
                                            <Plus className="ml-2 h-4 w-4" />
                                        </span>
                                    }
                                </Button>
                            </div>
                        </div>
                        {  newStreamUrl && newStreamUrl.match(youtubeRegex) && !newStreamLoading &&
                        <div className='flex-1 max-h-full max-w-md rounded-xl'>
                            <LiteYouTubeEmbed id={newStreamUrl.split("?v=")[1]} title='test'/>
                        </div>
                        }
                    </div>
                </div>
                
                { ytPreview &&
                <div className='flex flex-col justify-center bg-zinc-700 bg-opacity-25 backdrop-blur-3xl p-6 rounded-2xl w-2/3'>
                    {/* <LiteYouTubeEmbed id={currentStream?.extractedID || ""} title='test'/> */}
                    <h2 className="text-xl font-semibold mb-4 text-white">Now Playing</h2>
                    <div className={`flex flex-col items-center gap-3 ${isPlaying ? 'pointer-events-none cursor-not-allowed' : ''}`}>
                        <div ref={streamRef} className="w-full"/>
                        {/* <a href={currentStream?.url} className='w-full hover:scale-95 transition-all'>
                            <img src={currentStream?.smallThumbnail} alt="thumbnail" className='w-full rounded-xl'/>
                        </a> */}
                        <h3 className='text-lg font-semibold text-white w-full text-center'>{currentStream?.title}</h3>
                    </div>
                </div>
                }
            </section>

            {/* Song queue */}
            <section className="w-1/2 overflow-hidden flex flex-col gap-4">
                
                <div className='flex items-center justify-between pr-4'>
                    <h2 className="text-xl font-semibold text-white">Upcoming streams</h2>
                    
                    {streams.length > 0 &&
                    <Button className='bg-purple-600 hover:bg-purple-900 text-white'
                            onClick={handleShare}
                    >
                        <span className='flex items-center text-sm md:text-base'>
                            Share
                            <Share2 className="ml-2 h-4 w-4" />
                        </span>
                    </Button>
                    }
                </div>

                <ScrollArea className="flex-grow">
                    <div className="space-y-4 pr-4">
                    { !streamLoading ? streams.map(item => (
                        <Card key={item.id} className="bg-white bg-opacity-10 backdrop-blur-lg border-0 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center p-4">
                                <a href={item.url} target='_blank'  className="flex flex-col justify-center items-center relative w-52 h-w-52 mr-4 flex-shrink-0 hover:scale-95 transition-all">
                                    <img
                                    src={item.smallThumbnail}
                                    alt={item.title}
                                    className="rounded-md"
                                    />
                                </a>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-white text-lg">{item.title}</h3>     
                                </div>
                                <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-700 bg-opacity-10 backdrop-blur-3xl">
                                    <span className={`font-medium text-lg text-neutral-200`}>
                                        {item.upvoteCount > 0 ? item.upvoteCount : 0}
                                    </span>
                                    {!item.haveUpvoted ? 
                                        <Button className="bg-green-500 hover:bg-green-700 bg-opacity-20 hover:bg-opacity-30 text-white rounded-full"
                                                variant="default" 
                                                size="icon"
                                                onClick={() => vote(item.id, "upvote")}
                                        >   
                                            <ArrowUp className="h-6 w-6" />
                                            <span className="sr-only">Upvote</span>
                                        </Button>
                                        :
                                        <Button className="bg-red-500 hover:bg-red-700 bg-opacity-20 hover:bg-opacity-30 text-white rounded-full"
                                                variant="default" 
                                                size="icon"
                                                onClick={() => vote(item.id, "downvote")}
                                        >   
                                            <ArrowDown className="h-6 w-6" />
                                            <span className="sr-only">Downvote</span>
                                        </Button>
                                    }
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                    )) : <div className='flex flex-col gap-5'>
                            <div>
                                <Skeleton />
                            </div>
                            
                            <div>
                                <Skeleton />
                            </div>
                            
                            <div>
                                <Skeleton />
                            </div>
                        </div>
                    }
                    </div>
                </ScrollArea>
            </section>
        </main>
    </div>
    )
}
