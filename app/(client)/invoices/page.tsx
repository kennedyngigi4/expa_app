"use client";
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';


const InvoicesPage = () => {
  const { data:session } = useSession();

  const [invoices, setInvoices] = useState([]);


  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.");
      }

      const data = await APIServices.get("payments/customer_invoices/", session?.accessToken);
      setInvoices(data);
    }
    fetchData();
  }, [session]);

  return (
    <section className='min-h-screen md:px-20 px-5'>
      <div className='py-6'>
        <h1 className="text-primary font-semibold text-xl">My Invoices</h1>
        <p className='text-slate-500'>Invoices generated from your orders.</p>
      </div>

      <DataTable columns={columns} data={invoices} />
    </section>
  )
}

export default InvoicesPage