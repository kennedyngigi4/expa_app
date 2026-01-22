"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';


const ManagerHome = () => {

  const {data:session} = useSession();
  const [ allData, setAllData ] = useState({});

  useEffect(() => {
    const fetchData = async() => {
      if (!session?.accessToken) return;

      const res = await APIServices.get("deliveries/manager/dashboard/", session?.accessToken);
      
      setAllData(res);
    } 
    fetchData();
  }, [session]);

  return (
    <section className='flex flex-col'>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-amber-600">{allData?.unassigned_orders}</h1>
          </CardHeader>
          <CardContent>
            Unassigned Orders
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-amber-600">{allData?.orders}</h1>
          </CardHeader>
          <CardContent>
            All Orders
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-amber-600">{allData?.shipments_in}</h1>
          </CardHeader>
          <CardContent>
            Shipments In
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-amber-600">{allData?.shipments_out}</h1>
          </CardHeader>
          <CardContent>
            Shipments Out
          </CardContent>
        </Card>
      </div>

      <div className='pt-8'>
        <h1 className='text-primary pb-3'>Recent Shipments</h1>
        {allData?.recent_shipments?.map((shipment: any) => (
          <div key={shipment.id} className='grid md:grid-cols-5 gap-5 grid-cols-1 pb-3 mb-4 border-b-2 border-b-slate-50'>
            <div className='flex flex-col'>
              <h1 className='text-xs'>Shipment ID</h1>
              <p className='text-sm'>{shipment?.shipment_id}</p>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-xs'>Shipment Type</h1>
              <p className='text-sm capitalize'>{shipment?.shipment_type}</p>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-xs'>Status</h1>
              <p className='text-sm capitalize'>{shipment?.status}</p>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-xs'>Summary</h1>
              <p className='truncate text-sm'>{shipment?.summary}</p>
            </div>
            
            <div className='flex flex-col justify-center items-center'>
              <Link href={`/dashboard/manager/shipments/${shipment.id}/`}><MoreHorizontal /></Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ManagerHome