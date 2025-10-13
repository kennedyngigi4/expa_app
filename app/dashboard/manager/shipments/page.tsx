"use client";

import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { useSession } from 'next-auth/react';
import { APIServices } from '@/lib/utils/api_services';
import { Button } from '@/components/ui/button';
import { ShipmentModel } from '@/lib/models/all_models';

const ShipmentsPage = () => {
  const {data:session} = useSession();
  const [shipments, setShipments] = useState<ShipmentModel[]>([]);
  const [category, setCategory ]= useState("all");

  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.")
      }
      const data = await APIServices.get(`deliveries/manager/shipments/?category=${category}`, session?.accessToken);
      setShipments(data);
    }
    fetchData();
  }, [session, category]);

  return (
    <section>

      <div className='flex flex-col pb-8'>
        <h1 className='text-primary font-semibold text-xl'>All Shipments</h1>
        <p className='text-slate-500'>All shipments done in your office and by you.</p>
      </div>


      <div className='flex space-x-2.5 mb-5'>
        {["all", "assigned", "in_transit", "delivered", "received",  "returned", "cancelled"].map((cat) => (
          <Button 
            key={cat}
            variant={category === cat ? "default" : "outline"}
            onClick={() => setCategory(cat)}
            className="cursor-pointer"
          >
            {cat.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        ))}
      </div>


      <DataTable columns={columns} data={shipments} />
    </section>
  )
}

export default ShipmentsPage