'use client';

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

interface ProviderProp{
    children: React.ReactNode
}

export function Provider( { children }: ProviderProp ){
    return <SessionProvider>    
        {children}
        
        <ToastContainer
            position="bottom-right"
            autoClose={1900}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="dark"
        />
    </SessionProvider>
}
