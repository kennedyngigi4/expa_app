"use client";

import { Card, CardContent } from '@/components/ui/card';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const ConsolidatedInvoices = () => {
    const {data:session} = useSession();
    const [invoicesData, setInvoicesData] = useState({});
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async() => {
            if(!session?.accessToken) return;

            const resp = await APIServices.get("payments/superadmin/consolidated_invoices/", session?.accessToken);
            console.log(resp);
            setInvoicesData(resp);
            setInvoices(resp?.serialized_invoices || []);
            
        }
        fetchInvoices();
    }, [session]);

  return (
    <section className="flex flex-col gap-8">
        <div className="grid md:grid-cols-4 gap-6">
            <Card>
                <CardContent>
                    <h1 className='text-2xl font-semibold text-orange-500'>{invoicesData?.consolidated_count}</h1>
                    <h4 className='text-sm font-semibold pt-2'>Consolidated</h4>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <h1 className='text-2xl font-semibold text-orange-500'>{invoicesData?.paid_count}</h1>
                    <h4 className='text-sm font-semibold pt-2'>Paid</h4>
                </CardContent>
            </Card>
        </div>


        <div>
            <DataTable columns={columns} data={invoices} />
        </div>
    </section>
  )
}

export default ConsolidatedInvoices