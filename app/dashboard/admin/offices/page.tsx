"use client";

import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { useSession } from 'next-auth/react';
import { APIServices } from '@/lib/utils/api_services';
import { OfficeModel } from '@/lib/models/all_models';

const OfficesPage = () => {
  const {data:session} = useSession();
  const [offices, setOffices] = useState<OfficeModel[]>([]);


  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.");
      }

      const res = await APIServices.get('account/superadmin/offices/', session?.accessToken);
      setOffices(res.results);
    }
    fetchData();
  }, [session]);

  return (
    <section className="py-5">
      <DataTable columns={columns} data={offices} />
    </section>
  )
}

export default OfficesPage