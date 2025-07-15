"use client";

import { PackageModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';


const OrdersPage = () => {
  const {data:session} = useSession();
  const [ orders, setOrders ] = useState<PackageModel[]>([]);


  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.");
      }

      const data = await APIServices.get("deliveries/superadmin/packages/", session?.accessToken);
      setOrders(data);
    }
    fetchData();
  },[session]);

  return (
    <section>
      <div>
        <h1 className='text-primary font-semibold'>All Orders</h1>
        <p className="text-slate-500">All orders made.</p>
      </div>

      <DataTable columns={columns} data={orders} />
    </section>
  )
}

export default OrdersPage