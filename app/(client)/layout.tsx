"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from './_components/navbar';
import Footer from '../_components/footer';
import Loader from '@/components/modals/loader';


const ClientLayout = ({ children } : { children: React.ReactNode }) => {
    const { data:session, status } = useSession();
    const router = useRouter();

    const [ isReady, setIsReady ] = useState(false);
    
    useEffect(() => {

        
        

        if (status === "loading" ) return;

        if(status === "unauthenticated"){
            router.push("/auth/login");
        } else {
            setIsReady(true);
        }
    }, [status, router]);


    if(!isReady){
        return (
            <div className="flex w-full h-screen justify-center items-center">
                <Loader />
            </div>
        );
    }

    return (
        <section>
            <Navbar />
            <div className=''>
                {children}
            </div>
            <Footer />
        </section>
    )
}

export default ClientLayout