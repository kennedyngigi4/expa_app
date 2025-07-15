"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, HandCoinsIcon, File, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './orders/_components/data-table';
import { columns } from './orders/_components/columns';
import { useSession } from 'next-auth/react';
import { NotificationModel, PackageModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { notificationsColumns } from './notifications/_components/columns';


const PartnerHome = () => {

  const {data:session} = useSession();
  const [ orders, setOrders ] = useState<PackageModel[]>([]);
  const [ notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [ statistics, setStatistics ] = useState<any>({});

  useEffect(() => {
      const fetchData = async() => {
        if(!session?.accessToken){
            throw new Error("You must be logged in.");
        }

        const res = await APIServices.get("deliveries/partnershop/packages/", session?.accessToken);
        const notificationsData = await APIServices.get("messaging/partnershop/notifications/", session?.accessToken);
        const statisticsData = await APIServices.get("account/partnershop/statistics/", session?.accessToken); 
                    
        setOrders(res);
        setNotifications(notificationsData);
        setStatistics(statisticsData);
      }
      fetchData();
  }, [session]);

  return (
    <section className='flex flex-col space-y-3.5'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        
        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Package className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">{statistics.packages}</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Orders</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <File className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">{statistics.invoices}</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Invoices</p>
          </CardContent>
        </Card>


        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Bell className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">{statistics.notifications}</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Notifications</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <HandCoinsIcon className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">1,000,000 <span className='text-xs font-semibold text-slate-500'>KSH</span></CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Earnings</p>
          </CardContent>
        </Card>
      </div>


      <div className='flex flex-col pt-8'>
        <h1 className='text-primary font-semibold text-lg'>Latest Orders</h1>

        <div>
          <DataTable columns={columns} data={orders.slice(0,8)} />
        </div>
      </div>

      
      <div className='flex flex-col pt-5'>
        <h1 className='text-primary font-semibold text-lg'>Notifications</h1>

        <div>
          <DataTable columns={notificationsColumns} data={notifications.slice(0, 8)} />
        </div>
      </div>

    </section>
  )
}

export default PartnerHome