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
            const role = session?.user?.role;
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
                // case "partner_rider":
                //     router.push("/confirm");
                //     break;
                // case "driver":
                //     router.push("/confirm");
                //     break;
                default:
                    router.push("/");
                    break;
            }

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