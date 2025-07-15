"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { notificationsColumns } from './_components/columns';
import { useSession } from 'next-auth/react';
import { NotificationModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';


const NotificationsPage = () => {
    const {data:session} = useSession();
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);

    useEffect(() => {
        const fetchData = async() => {
            if(!session?.accessToken){
                throw new Error("You must be logged in.");
            }

            const res = await APIServices.get("messaging/partnershop/notifications/", session?.accessToken);
            
            setNotifications(res);
        }
        fetchData();
    }, [session])


    return (
        <section className="flex flex-col md:w-[80%] w-[90%] mx-auto">
            <div className='flex md:flex-row justify-between flex-col'>
                <div>
                    <h1 className='text-primary font-semibold text-xl'>Notifications</h1>
                    <p className='text-slate-500'>All notifications for your packages.</p>
                </div>
            </div>

            <div>
                <DataTable columns={notificationsColumns} data={notifications} />
            </div>
        </section>
    )
}

export default NotificationsPage