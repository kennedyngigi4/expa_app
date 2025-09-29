"use client";
import { NotificationModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import Image from 'next/image';
import FAQS from '@/app/_components/faqs';

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

    <section className='min-h-screen '>
      <div className="bg-orange-100 flex md:flex-row flex-col justify-between items-center px-12 md:px-30 md:h-[300px] overflow-hidden">
        <div className="flex-1">
          <div className="py-10">
            <h1 className="font-bold text-2xl">Notifications</h1>
            <p className='text-slate-800'>All notifications of my orders.</p>
          </div>
        </div>

        
        <div className="relative flex-1 h-full overflow-hidden max-md:hidden">
          <Image
            src="/icons/avatar.png"
            alt="EXPA"
            fill
            className="object-contain md:object-right"
            priority
          />
        </div>
      </div>

      <section className="md:w-[70%] w-[90%] mx-auto pt-15">
        <DataTable columns={columns} data={notifications} />
      </section>

      <div className="w-full pt-5 pb-16 md:px-14 px-12 max-lg:hidden">
        <h1 className="text-center font-bold text-orange-600 text-xl">Frequently Asked Questions</h1>
        <p className="text-center text-slate-500">Common Questions abour shipping delivery and courier services</p>

        <div className="pt-4 w-[90%] mx-auto">
          <FAQS />
        </div>

      </div>
    </section>
    
  )
}

export default NotificationsPage