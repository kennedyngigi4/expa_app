"use client"

import { Mail, MapPin, Phone, PinIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <section className="bg-amber-600 text-white py-10 md:px-15 px-8 ">
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
        <div className="">
          <h1 className="text-2xl font-bold pb-4">EXPRESS PARCELS (EXPA)</h1>
          <p>We deliver parcels and cargo to Northern Kenya daily</p>
        </div>


        <div className="max-lg:col-span-1">
          <div className="flex flex-col space-y-3.5">
            <h1 className="font-bold">Helpful Links</h1>
            <nav className='w-full'>
              <ul className="flex flex-col space-y-2">
                <li><Link href="">Our Services</Link></li>
                <li><Link href="">Contact Us</Link></li>
                <li><Link href="">Privacy Policy</Link></li>
                <li><Link href="">Help Center</Link></li>
              </ul>
            </nav>
          </div>
        </div>


        <div className="flex flex-col space-y-3.5">
          <h1 className="font-bold">We Are Social</h1>
          <nav className='w-full'>
            <ul className="flex flex-col space-y-2">
              <li><Link href="">Express Parcel-EXPA</Link></li>
              <li><Link href="">@ExpaKenya</Link></li>
              <li><Link href="">expakenya</Link></li>
              <li><Link href="">Express Parcels Kenya</Link></li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col space-y-3.5">
          <h1 className="font-bold">Contact Us</h1>
          <div className="flex flex-row space-x-2">
            <Phone size={20} />
            <p>020 258 5290<br />
              0722 620 988<br />
              0734 620 988
            </p>
          </div>
          <div className="flex flex-row space-x-2">
            <Mail size={20} />
            <p>info@expa.co.ke</p>
          </div>
          <div className="flex flex-row space-x-2">
            <MapPin size={20} />
            <p>Expa House, Mai Mahiu Rd, South C, Nairobi</p>
          </div>
        </div>



      </div>
      <div className="mt-6 pt-4 text-center border-t-2 border-white border-dotted">&copy; 2025 EXPA | All Rights Reserved</div>
    </section>
  )
}

export default Footer