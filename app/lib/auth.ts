import Google from "next-auth/providers/google";
import { prismaClient } from "./db";

export const NEXT_AUTH = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user, account }: any){
            if(!user?.email){
                return false;
            }

            try {
                const provider = account?.provider;
                
                const findUser = await prismaClient.user.findUnique({
                    where: {
                        email: user?.email
                    }
                })
                if(findUser){
                    user.id = findUser.id;
                    return true;
                }

                const newUser = await prismaClient.user.create({  //create new user in the database, after signing-in
                    data: {
                        email: user?.email,
                        provider: (provider == "Google") ? "Google" : "Github"
                    }
                })
                user.id = newUser.id;
                
            } catch (error) {
                // return false;
            }
            return true;
        },
        async jwt({ token, user }: any){
            if(user){
                token.id = user.id
            }
            return token;
        },
        async session({ session, token }: any){
            if(token?.id){
                session.user.id = token.id;
            }

            return session;
        }
    }
}
