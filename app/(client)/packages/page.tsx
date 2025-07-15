"use client";

import { PackageModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const PackagesPage = () => {
  const { data:session} = useSession();
  const [ packages, setPackages ] = useState<PackageModel[]>([]);

  useEffect(() => {
    const fetchData = async()=> {

      if (!session?.accessToken) {
        throw new Error("You must be logged in.");
      }

      const res = await APIServices.get(`deliveries/user_packages/`, session?.accessToken);
      console.log(res);
      setPackages(res);
    } 
    fetchData();
  }, [session]);

  return (
    <section className='flex flex-col md:px-20 px-5 min-h-screen'>
      <div className='py-5'>
        <h1 className='text-primary font-semibold text-xl'>Packages</h1>
        <p className='text-slate-500'>A list of packages you have submitted for delivery.</p>
      </div>

      <div>
        <DataTable columns={columns} data={packages} />
      </div>
    </section>
  )
}

export default PackagesPage