"use client";

import React, { useEffect, useState } from 'react';
import { UserModel } from '@/lib/models/user_model';
import { useSession } from 'next-auth/react';
import { APIServices } from '@/lib/utils/api_services';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Map } from 'lucide-react';



const DriversPage = () => {
    const {data:session} = useSession();
    const [drivers, setDrivers] = useState<UserModel[]>([]);

    useEffect(() => {
        const fetchData = async() => {
            if(!session?.accessToken){
                throw new Error("You must be logged in.");
            }

            const roles = ['driver', 'partner_rider']
            const query = roles.map(r => `role=${r}`).join('&');

            const data = await APIServices.get(`account/superadmin/users/?${query}`, session?.accessToken);
            console.log(data);
            setDrivers(data);
        }
        fetchData();
    }, [session]);
    
    return (
        <section>
            <div className='flex md:flex-row flex-col gap-3 items-center justify-between'>
                <div className='py-5'>
                    <h1 className='text-primary font-semibold'>Drivers</h1>
                    <p className='text-slate-500'>All drivers, both company and partner riders</p>
                </div>

                <div>
                    <Link href="/dashboard/admin/drivers/locations">
                        <Button className='cursor-pointer'><Map /> Live Location</Button>
                    </Link>
                </div>
            </div>
            <DataTable columns={columns} data={drivers} />
        </section>
    )
}

export default DriversPage