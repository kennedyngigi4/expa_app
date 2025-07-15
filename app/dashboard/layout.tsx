"use client";

import Loader from '@/components/modals/loader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Sidebar from './_components/sidebar';
import DashboardNavbar from './_components/navbar';


const managerRoutes = [
    {
        label: "",
        icon: "",
        href: "/"
    }
]

const DashboardLayout = ({ children} : Readonly<{children: React.ReactNode}>) => {
    const router = useRouter();
    const { data:session, status }= useSession();
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
        <section className="h-full">
            <div></div>
            <div className="h-full hidden md:flex w-56 flex-col fixed inset-y-0 z-50 border-r-1 border-slate-50">
                <Sidebar />
            </div>
            <div className="h-full md:pl-56">
                <DashboardNavbar />
                <main className='px-6 md:pt-[28px] pt-16'>
                    {children}
                </main>
            </div>

        </section>
    );
}

export default DashboardLayout