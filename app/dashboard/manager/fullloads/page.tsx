"use client";

import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const FullloadsPage = () => {
    const {data:session} = useSession();
    const [fullloads, setFullloads] = useState([]);



    useEffect(() => {
        const fetchData = async() => {
            if(!session?.accessToken) return;

            const response = await APIServices.get("fullloads/manager/fullloads/", session?.accessToken);
            setFullloads(response);
        }   
        fetchData();
    }, [session]);

    return (
        <div>
            <DataTable columns={columns} data={fullloads} />
        </div>
    )
}

export default FullloadsPage