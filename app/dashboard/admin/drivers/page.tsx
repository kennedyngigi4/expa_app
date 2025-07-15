"use client";

import React, { useEffect, useState } from 'react';
import { UserModel } from '@/lib/models/user_model';
import { useSession } from 'next-auth/react';
import { APIServices } from '@/lib/utils/api_services';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';



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
            
            setDrivers(data);
        }
        fetchData();
    }, [session]);
    
    return (
        <section>
            <div className='py-5'>
                <h1 className='text-primary font-semibold'>Drivers</h1>
                <p className='text-slate-500'>All drivers, both company and partner riders</p>
            </div>
            <DataTable columns={columns} data={drivers} />
        </section>
    )
}

export default DriversPage