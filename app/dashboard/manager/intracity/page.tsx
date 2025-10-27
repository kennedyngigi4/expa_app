"use client"
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { useSession } from 'next-auth/react'
import { PackageModel } from '@/lib/models/all_models'
import { APIServices } from '@/lib/utils/api_services'
import { Button } from '@/components/ui/button'

const IntracityPage = () => {
    const { data:session } = useSession();
    const [category, setCategory] = useState("all");
    const [ orders, setOrders ]= useState<PackageModel[]>([]);

    useEffect(() => {
    const fetchData = async() => {

        if(!session?.accessToken){
        throw new Error("You must be loggedin.");
        }

        
        const data = await APIServices.get(`deliveries/manager/origin_packages/?category=${category}&delivery_type=intra_city`, session?.accessToken);
        console.log();
        setOrders(data);
    }
    fetchData()
    }, [session, category]);

  return (
      <section className='flex flex-col'>
          <div className='pb-12'>
              <h1 className='text-primary font-semibold text-xl'>Intracity Waybills</h1>
              <p className='text-slate-500'>Here are all intracity orders made through your office. Use filters below.</p>
          </div>

          <div className="flex space-x-2 mb-4">
              {["all", "pending", "assigned", "in_transit", "delivered"].map((cat) => (
                  <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      onClick={() => setCategory(cat)}
                      className='cursor-pointer'
                  >
                      {cat.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Button>
              ))}
          </div>
          <DataTable columns={columns} data={orders} />
      </section>
  )
}

export default IntracityPage