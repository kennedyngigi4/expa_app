"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import React from 'react';

const DashboardNavbar = () => {
  const {data:session} = useSession();

  const logOut = async() => {
    await signOut();
  }

  return (
    <section className='px-6 py-3 shadow h-12 flex justify-between'>
      <p className='capitalize text-primary font-semibold'>{session?.user?.role === "partner_shop" ? "ExPa Collection Agent" : session?.user?.role}</p>
      <Avatar onClick={logOut}>
        <AvatarImage src="" />
        <AvatarFallback className="bg-amber-600 text-white uppercase font-bold">{session?.user?.name?.slice(0, 1)}</AvatarFallback>
      </Avatar>
    </section>
  )
}

export default DashboardNavbar