"use client";

import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';


const NotificationsPage = () => {
    const {data:session} = useSession();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            if(!session?.accessToken)return;
            const data = await APIServices.get('messaging/notifications/', session?.accessToken);
            
            setNotifications(data.results);
        }
        fetchData();
    }, [session]);

    return (
        <section className='flex flex-col'>
            <div className="pb-5">
                <h1 className="text-orange-500 font-semibold">Notifications</h1>
            </div>

            <DataTable columns={columns} data={notifications} />
        </section>
    )
}

export default NotificationsPage