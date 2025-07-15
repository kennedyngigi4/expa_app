"use client"

import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import LogoImage from '@/app/_components/logo';


const Navbar = () => {
  const { data: session, status } = useSession();

  const logOut = async() => {
    await signOut();
  }

  return (
    <nav className="flex flex-row md:px-15 px-8 justify-between items-center shadow py-3 sticky top-0 bg-white z-50">
      <Link href="/"><LogoImage /></Link>

      <div className="flex flex-row space-x-10">
        <ul className="flex flex-row space-x-10">
          <li><Link href="/packages">Orders</Link></li>
          <li><Link href="/invoices">Invoices</Link></li>
          <li><Link href="/notifications">Notifications</Link></li>
        </ul>

        {/* <Link href="/profile"> */}
          <Avatar onClick={logOut}>
            <AvatarImage src="" />
            <AvatarFallback className="bg-amber-600 text-white uppercase font-bold">{session?.user?.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
        {/* </Link> */}
      </div>
    </nav>
  )
}

export default Navbar