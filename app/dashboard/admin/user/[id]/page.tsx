"use client";

import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/orders/data-table';
import { columns } from './_components/orders/columns';
import { InvoiceDataTable } from './_components/invoices/data-table';
import { InvoiceColumns } from './_components/invoices/columns';


const UserPage = () => {
  const {data:session} = useSession();
  const params = useParams();
  const id = params.id;

  const [userData, setUserData] = useState({});

  useEffect(() => {
    

    const userDetails = async() => {
      if (!session?.accessToken) return;

      const response = await APIServices.get(`account/superadmin/user_details/${id}/`, session?.accessToken);
      console.log(response);
      setUserData(response);
    }
    userDetails();
  }, [sessionStorage, id]);


  return (
    <section className="flex flex-col space-y-6 pb-12">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mb-10">
        <div>
          <h1 className='font-bold text-xl'>{userData?.user?.full_name}</h1>
          <p className='text-xs text-green-700'>Since: {new Date(userData?.user?.date_joined).toLocaleDateString("en-us", {year: "numeric", month: "short", day: "numeric"})}</p>
        </div>
        <div>
          <h1>{userData?.user?.phone}</h1>
          <h1>{userData?.user?.email}</h1>
          
        </div>
        <div>
          <h1 className="capitalize">Account: <br /> <span className="font-semibold">{userData?.user?.account_type}</span></h1>
          
        </div>
      </div>

      {userData?.orders?.length > 0 && (
        <div className='flex flex-col'>
          <h1 className='font-semibold text-lg pb-1 text-orange-500'>{userData?.orders.length} Orders</h1>
          <DataTable columns={columns} data={userData?.orders} />
        </div>
      )}


      {userData?.invoices?.length > 0 && (
        <div className='flex flex-col'>
          <h1 className='font-semibold text-lg pb-1 text-orange-500'>{userData?.invoices.length} Invoices </h1>

          <InvoiceDataTable columns={InvoiceColumns} data={userData?.invoices} />
        </div>
      )}

      
    </section>
  )
}

export default UserPage