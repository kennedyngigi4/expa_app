"use client";
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowUp, Package, File } from 'lucide-react';


const InvoicesPage = () => {
  const { data:session } = useSession();

  const [invoices, setInvoices] = useState([]);
  const [ statsData, setStatsData ] = useState({});

  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.");
      }

      const data = await APIServices.get("payments/customer_invoices/", session?.accessToken);
      setInvoices(data);

      if (session?.user?.accounttype === "business"){
        const stats = await APIServices.get('deliveries/business_stats/', session?.accessToken);
        setStatsData(stats);
      }
    }
    fetchData();
  }, [session]);

  return (
    <section className='min-h-screen md:px-20 px-5'>

      {session?.user?.accounttype === "business" && (
        <div className='grid md:grid-cols-4 grid-cols-1 gap-5 pt-8'>
          <Card className="relative overflow-hidden">
            <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
              <Package className="w-36 h-36 text-primary" />
            </div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-primary font-medium text-xl">{statsData?.all_orders}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p>Total Orders</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
              <File className="w-36 h-36 text-primary" />
            </div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-primary font-medium text-xl">{statsData?.unpaid_invoices}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p>Unpaid Invoices</p>
            </CardContent>
          </Card>


          <Card className="relative overflow-hidden">
            <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
              <BanknoteArrowUp className="w-36 h-36 text-primary" />
            </div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-primary font-medium text-xl">{parseInt(statsData?.total_amount_unpaid).toLocaleString()}<span className='text-xs'>KSh</span></CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p>Total Amount Unpaid</p>
            </CardContent>
          </Card>
        </div>
      )}


      <div className='py-6'>
        <h1 className="text-primary font-semibold text-xl">My Invoices</h1>
        <p className='text-slate-500'>Invoices generated from your orders.</p>
      </div>

      <DataTable columns={columns} data={invoices} />
    </section>
  )
}

export default InvoicesPage