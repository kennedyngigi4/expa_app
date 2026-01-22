"use client";

import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const PaymentsPage = () => {
  const {data:session} = useSession();
  const [payments, setPayments] = useState([]);


  useEffect(() => {
    const fetchPayments = async() => {
      if(!session?.accessToken) return;

      const response = await APIServices.get("payments/superadmin/all/", session?.accessToken);
      setPayments(response.results);
    }
    fetchPayments();
  }, [session]);

  return (
    <section className="flex flex-col py-1">
      <div className='mb-10'>
        <h1 className='text-primary font-semibold'>All Payments</h1>
        <p className="text-slate-500">All transactions made.</p>
      </div>

      <DataTable columns={columns} data={payments} />
    </section>
  )
}

export default PaymentsPage