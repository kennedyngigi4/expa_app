"use client";

import { RouteModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const RoutesPage = () => {
  const {data:session} = useSession();
  const [routes, setRoutes] = useState<RouteModel[]>([]);

  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.");
      }

      const res = await APIServices.get("deliveries/superadmin/intercounty_routes/", session?.accessToken);
      console.log(res);
      setRoutes(res);
    }
    fetchData();
  }, [session]);

  return (
    <section className='flex flex-col space-y-3.5'>
      <div className='pb-5'>
        <h1 className='text-primary font-semibold'>All Routes</h1>
        <p className="text-slate-500">Set inter county routes.</p>
      </div>

      <DataTable columns={columns} data={routes} />
    </section>
  )
}

export default RoutesPage