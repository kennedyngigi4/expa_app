"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from './_components/navbar';
import Footer from '../_components/footer';
import Loader from '@/components/modals/loader';
import { useProfile } from '@/hooks/profile_hook';


const ClientLayout = ({ children } : { children: React.ReactNode }) => {
    const { data:session, status } = useSession();
    const router = useRouter();
    const { profile, isLoading } = useProfile();

    const [ isReady, setIsReady ] = useState(false);
    
    useEffect(() => {
        if (isLoading) return;

        if(status === "unauthenticated"){
            router.push("/auth/login");
        } else if(profile) {

            const role = profile.role;
            switch (role) {
                case "admin":
                    router.push("/dashboard/admin");
                    break;
                case "manager":
                    router.push("/dashboard/manager");
                    break;
                case "partner_shop":
                    router.push("/dashboard/partner");
                    break;
                
                default:
                    router.push("/");
                    break;
            }

            setIsReady(true);
        }
    }, [status, isLoading, profile?.role, router]);



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