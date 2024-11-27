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
    }, [status])

    return null;
}

export default Redirect;
