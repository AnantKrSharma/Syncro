'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Redirect(){
    const { status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if(status == "unauthenticated"){
            router.push('/')
        }
    }, [status, router])

    return null;
}

export default Redirect;
