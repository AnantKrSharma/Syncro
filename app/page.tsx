import { AppBar } from "./components/AppBar";
import { Button } from "@/components/ui/button";
import { PlayCircle, Headphones, Radio, Mic2, Library, Music } from 'lucide-react'
import Link from "next/link";
import SignUpButton from "./components/SignUpButton";
import Redirect from "./components/Redirect";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950 text-white">
      <AppBar page="landing"/>
      
      <Redirect />

      <main className="flex-1">
        <section className="w-full py-20 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <img
                alt="Hero"
                className="mx-auto  overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                height="550"
                src="https://cdni.iconscout.com/illustration/premium/thumb/man-listening-music-illustration-download-in-svg-png-gif-file-formats--enjoying-guy-business-pack-people-illustrations-4443158.png"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 py-2">
                    Your Music, Your Way
                  </h1>
                  <p className="max-w-[600px] text-purple-100 text-sm sm:text-base md:text-xl">
                    Stream millions of songs, create playlists, and discover new artists. All in one place.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="bg-purple-600 text-white hover:bg-purple-800">Get Started</Button>
                  <Button variant="default" className="bg-blue-500 hover:bg-blue-800 hover:text-white">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 px-4 md:px-6">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 py-[7px]">Features</h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: PlayCircle, title: "Unlimited Streaming", description: "Listen to your favorite music anytime, anywhere." },
                  { icon: Headphones, title: "High-Quality Audio", description: "Experience crystal-clear sound with our HD streaming." },
                  { icon: Radio, title: "Personalized Radio", description: "Discover new music tailored to your taste." },
                  { icon: Mic2, title: "Lyrics", description: "Sing along with real-time lyrics for millions of songs." },
                  { icon: Library, title: "Offline Mode", description: "Download your favorite tracks and listen offline." },
                  { icon: Music, title: "Curated Playlists", description: "Enjoy expertly curated playlists for every mood and occasion." },
                ].map((feature, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-purple-500/30 to-indigo-600/30 backdrop-blur-sm hover:from-purple-800/40 hover:to-indigo-900/40 transition-all">
                        <feature.icon className="h-12 w-12 text-purple-400" />
                        <h3 className="text-lg sm:text-xl font-bold text-purple-300">{feature.title}</h3>
                        <p className="text-purple-100 text-center text-sm sm:text-base">{feature.description}</p>
                    </div>
                ))}
            </div>

          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center space-y-7 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 py-[7px]">Start Listening Today</h2>
                  <p className="max-w-[900px] text-purple-100 text-sm sm:text-base md:text-lg lg:text-xl">
                    Join millions of music lovers and start your journey with our app. Get access to unlimited music, personalized playlists, and more.
                  </p>
                </div>
                
                <div className="w-full max-w-sm space-y-2">
                  <SignUpButton />

                  <p className="text-sm text-purple-200">
                    By signing up, you agree to our{" "}
                    <Link className="underline underline-offset-2 hover:text-purple-400" href="#">
                      Terms & Conditions
                    </Link>
                  </p>
                </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-4 md:px-6 border-t border-purple-800/20 bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-900">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-purple-300 text-center sm:text-left">© 2024 Syncro Inc. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm hover:underline underline-offset-4 text-purple-300 hover:text-purple-400" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm hover:underline underline-offset-4 text-purple-300 hover:text-purple-400" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
