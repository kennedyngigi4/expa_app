"use client";

import { UserModel } from '@/lib/models/user_model';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const ClientsPage = () => {
    const { data: session } = useSession();
    const [clients, setClients] = useState<UserModel[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.accessToken) {
                throw new Error("You must be logged in.");
            }

            const role = "client";
            const res = await APIServices.get(`account/superadmin/users/?role=${role}`, session?.accessToken);
            setClients(res);
        }
        fetchData();
    }, [session]);
    
  return (
    <section>
        <div className='py-3'>
            <h1 className='text-primary font-semibold text-xl'>Clients</h1>
            <p className='text-slate-500'>Registered clients.</p>
        </div>
        <DataTable columns={columns} data={clients} />
    </section>
  )
}

export default ClientsPage