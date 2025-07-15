"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { InvoiceModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';



const InvoicesPage = () => {
  const {data:session } = useSession();
  const [ invoices, setInvoices] = useState<InvoiceModel[]>([]);

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
    <section>
      <div>
        <h1 className='text-primary font-semibold'>Invoices</h1>
      </div>

      <div>
        <DataTable columns={columns} data={invoices} />
      </div>
    </section>
  )
}

export default InvoicesPage