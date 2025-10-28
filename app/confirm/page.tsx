"use client";

import { useSession } from 'next-auth/react';
import React from 'react';

const ConfirmationsPage = () => {
  const {data:session} = useSession();

  return (
    <section className='flex flex-col space-y-5'>
      <div className='flex flex-col mb-10'>
        <h1 className='font-semibold'>Hello {session?.user?.name}</h1>
        <p className='text-slate-500'>These are your confirmations.</p>
      </div>


    
    </section>
  )
}

export default ConfirmationsPage