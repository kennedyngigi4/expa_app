"use client";

import { Button } from '@/components/ui/button';
import { PackageModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const IncomingOrders = () => {
    const { data: session } = useSession();
    const [category, setCategory] = useState("all");
    const [orders, setOrders] = useState<PackageModel[]>([]);

    useEffect(() => {
        const fetchData = async () => {

            if (!session?.accessToken) return;

            const data = await APIServices.get(`deliveries/manager/incoming_packages/?category=${category}&delivery_type=inter_county`, session?.accessToken);
            
            setOrders(data.results);
        }
        fetchData()
    }, [session, category]);

    return (
        <section className='flex flex-col'>
            <div className='pb-12'>
                <h1 className='text-primary font-semibold text-xl'>Incoming Waybills</h1>
                <p className='text-slate-500'>Here are all incoming waybills.</p>
            </div>

            <div className="flex space-x-2 mb-4">
                {["all", "pending", "assigned", "in_transit", "in_office", "delivered"].map((cat) => (
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

export default IncomingOrders