"use client";

import { UserModel } from '@/lib/models/user_model';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';


const EmployeesPage = () => {

  const {data:session} = useSession();
  const [employees, setEmployees ] = useState<UserModel[]>([]);

  useEffect(() => {
    const fetchData = async() => {
      if(!session?.accessToken){
        throw new Error("You must be logged in.");
      }

      const roles = ['manager'];
      const query = roles.map(r => `role=${r}`).join('&');

      const data = await APIServices.get(`account/superadmin/users/?${query}`, session?.accessToken);
      
      setEmployees(data);
    }
    fetchData();
  }, [session]);

  return (
    <section>
      <div className='py-4'>
        <h1 className='text-primary font-semibold'>Employees</h1>
        <p className='text-slate-500'>All employees.</p>
      </div>
      
      <DataTable columns={columns} data={employees} />
    </section>
  )
}

export default EmployeesPage