"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { APIServices } from '@/lib/utils/api_services';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { ShipmentModel } from '@/lib/models/all_models';



const ShipmentsPage = () => {
  const {data:session} = useSession();
  const [shipments, setShipments] = useState<ShipmentModel[]>([]);

  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken) return;

      const data = await APIServices.get("deliveries/superadmin/shipments/", session?.accessToken);
      
      setShipments(data.results);
    }
    fetchData();
  }, [session]);

  return (
    <section>
      <div className='py-4'>
        <h1 className='text-primary'>Shipments</h1>
        <p className='text-slate-500'>All Shipments.</p>
      </div>

      <DataTable columns={columns} data={shipments} />
    </section>
  )
}

export default ShipmentsPage