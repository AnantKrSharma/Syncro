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
        async signIn({ user, account }){
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
                // eslint-disable-line @typescript-eslint/no-unused-vars
                // return false;
            }
            return true;
        },
        async jwt({ token, user }){
            if(user){
                token.id = user.id
            }
            return token;
        },
        async session({ session, token }){
            if(token?.id){
                session.user.id = token.id;
            }

            return session;
        }
    }
}
