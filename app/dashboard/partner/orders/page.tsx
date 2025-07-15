"use client"

import { Button } from '@/components/ui/button'
import { PackageModel } from '@/lib/models/all_models'
import { APIServices } from '@/lib/utils/api_services'
import { PlusCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'

const OrdersPage = () => {
    const {data:session} = useSession();
    const [orders, setOrders] = useState<PackageModel[]>([]);

    useEffect(() => {
        const fetchData = async() => {
            if(!session?.accessToken){
                throw new Error("You must be logged in.");
            }

            const res = await APIServices.get("deliveries/partnershop/packages/", session?.accessToken);
            console.log(res);
            setOrders(res);
        }
        fetchData();
    }, [session]);

    return (
        <section>
            <div className='flex md:flex-row justify-between flex-col'>
                <div>
                    <h1 className='text-primary font-semibold text-xl'>All Packages</h1>
                    <p className='text-slate-500'>All packages you have uploaded.</p>
                </div>
                <div>
                    <Link href="/dashboard/partner/orders/create">
                        <Button className="cursor-pointer" variant="default"><PlusCircle /> Create Order</Button>
                    </Link>
                </div>
            </div>

            <div>
                <DataTable columns={columns} data={orders} />
            </div>
        </section>
    )
}

export default OrdersPage