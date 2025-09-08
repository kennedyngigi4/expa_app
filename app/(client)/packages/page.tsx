"use client";

import { PackageModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowUp, File, Package } from 'lucide-react';
import { CorporateTable } from './_components/corporate-table';
import { CorporateColumns } from './_components/corporate-columns';

const PackagesPage = () => {
  const { data:session} = useSession();
  const [ clientPackages, setClientPackages ] = useState<PackageModel[]>([]);
  const [ businessPackages, setBusinessPackages] = useState<PackageModel[]>([]);
  const [ statsData, setStatsData ] = useState({});

  useEffect(() => {
    const fetchData = async()=> {

      if (!session?.accessToken) {
        throw new Error("You must be logged in.");
      }
      
      const [ clientPackages, businessPackages ] = await Promise.all([
        await APIServices.get(`deliveries/user_packages/`, session?.accessToken),
        await APIServices.get(`corporate/orders/`, session?.accessToken)
      ]);

      if (session?.user?.accounttype === "business"){
        const stats = await APIServices.get('deliveries/business_stats/', session?.accessToken);
        setStatsData(stats);
      }
      
      setClientPackages(clientPackages);
      setBusinessPackages(businessPackages);
    } 
    fetchData();
  }, [session]);

  return (
    <section className='flex flex-col md:px-20 px-5 min-h-screen'>

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




      <div className='py-5'>
        <h1 className='text-primary font-semibold text-xl'>Packages</h1>
        <p className='text-slate-500'>A list of packages you have submitted for delivery.</p>
      </div>

      <div>
        {session?.user?.accounttype === "business" ? (
          <CorporateTable columns={CorporateColumns} data={businessPackages} />
        ) : (
          <DataTable columns={columns} data={clientPackages} />
        )}
        
      </div>
    </section>
  )
}

export default PackagesPage