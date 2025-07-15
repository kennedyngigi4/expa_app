"use client";
import { NotificationModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const NotificationsPage = () => {
  const {data:session} = useSession();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);


  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.");
      }

      const data = await APIServices.get("messaging/customer_notifications/", session?.accessToken);
      setNotifications(data);
    }
    fetchData();
  }, [session]);

  return (
    <section className="min-h-screen md:w-[70%] w-[90%] mx-auto">
      <div className='py-5'>
        <h1 className='text-primary font-semibold text-lg'>All Notifications</h1>
      </div>

      <DataTable columns={columns} data={notifications} />
    </section>
  )
}

export default NotificationsPage