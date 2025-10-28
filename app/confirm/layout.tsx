"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ConfirmLayout = ({ children }: { children: React.ReactNode}) => {
    const { data:session, status } = useSession();
    const router = useRouter();
    const [ isReady, setIsReady ] = useState(false);
        
    useEffect(() => {
        if (status === "loading" ) return;
        const role = session?.user?.role;

        if (role !== "partner_rider" &&
            role !== "manager" &&
            role !== "driver" &&
            role !== "admin" ){
            router.push("/auth/login");
        } else {
            router.push("/confirm");
            setIsReady(true);
        }
    }, [status, router, session]);

    return (
        <section className='min-h-screen px-20 py-10'>
            {children}
        </section>
    );
}

export default ConfirmLayout