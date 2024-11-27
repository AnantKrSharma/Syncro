'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, Menu, ListVideo } from 'lucide-react';
import { useState } from "react";
import Redirect from "./Redirect";

export const AppBar = ({ page = "landing" }: { page: string }) => {
    const { status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
        <header className="px-4 lg:px-6 h-16 flex items-center border-b text-white border-indigo-900 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900">
            <Link className="flex items-center justify-center" href="#">
                <Music className="h-6 w-6 text-purple-400" />
                <span className="ml-2 text-lg font-bold">Syncro</span>
            </Link>

            <Redirect />

            <nav className="ml-auto hidden md:flex md:items-center gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
                    Features
                </Link>
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
                    Pricing
                </Link>
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
                    About
                </Link>
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
                    Contact
                </Link>
                <div className="flex items-center [&>*]:p-2">
                    { status == "authenticated" 
                        ?
                        <div className="md:flex md:items-center gap-4">
                            {
                            page != "dashboard" &&
                            <Link href={'/dashboard'} className="bg-indigo-600 hover:bg-indigo-800 transition-all flex items-center gap-2 py-[10px] rounded-lg font-semibold text-sm px-3" 
                            >
                                <span>
                                    My Streams
                                </span>
                                <ListVideo />
                            </Link>
                            }
                            
                            <Button className="bg-purple-600 text-white hover:bg-purple-700 py-[10px] px-3" 
                                    variant="default" 
                                    size="lg"
                                    onClick={() => signOut()}
                                    >   Log-Out
                            </Button>
                        </div>
                            :
                        <Button className="bg-purple-600 text-white hover:bg-purple-700 py-[10px] px-3" 
                                variant="default" 
                                size="lg"
                                onClick={() => signIn()}
                        >   Sign-In
                        </Button>
                    }
                </div>
            </nav>

            <Button className="ml-auto md:hidden" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
            </Button>
        </header>
        {isMenuOpen && (
            <div className="md:hidden">
            <nav className="flex flex-col items-center py-4 bg-indigo-300/60">
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors py-2" href="#">
                Features
                </Link>
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors py-2" href="#">
                Pricing
                </Link>
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors py-2" href="#">
                About
                </Link>
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors py-2" href="#">
                Contact
                </Link>
                <div className="flex items-center [&>*]:p-2">
                    { status == "authenticated" ?
                        <div className="flex flex-col items-center justify-center md:flex md:items-center gap-4">
                            {
                            page != "dashboard" &&
                            <Link href={'/dashboard'} className="bg-indigo-600 hover:bg-indigo-800 transition-all flex items-center gap-2 py-[10px] rounded-lg font-semibold text-sm px-3" 
                            >
                                <span>
                                    My Streams
                                </span>
                                <ListVideo />
                            </Link>
                            }
                            <Button className="bg-purple-600 text-white hover:bg-purple-700 py-[10px] px-3" 
                                    variant="default" 
                                    size="lg"
                                    onClick={() => signOut()}
                                    >   Log-Out
                            </Button>
                        </div>
                            :
                        <Button className="bg-purple-600 text-white hover:bg-purple-700 py-[10px] px-3" 
                                variant="default" 
                                size="lg"
                                onClick={() => signIn()}
                        >   Sign-In
                        </Button>
                    }
                </div>
            </nav>
            </div>
        )}
    </>
    )
}
