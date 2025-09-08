"use client"

import { useSession } from 'next-auth/react'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FAQS from '../_components/faqs';
import FullLoadsForm from './_components/full-loads-form';

const ClientPage = () => {

  const { data:session } = useSession();
  const router = useRouter();

  const handleDelivery = async (value: string) => {
    sessionStorage.setItem("deliveryType", value);
    router.push("/create_package");
  }

  return (
    <section className="flex flex-col py-8">

      <div className="flex md:flex-row flex-col justify-between items-center md:px-30 px-12 ">
        <div>
          <h1 className="font-bold text-xl">Welcome {session?.user?.name}!</h1>
          <p className="text-slate-500">What would you like EXPA to deliver on your behalf?</p>
        </div>
      </div>

      <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-4 pt-15 md:px-30 px-12">
        <div className="grid md:grid-cols-2 grid-cols-1 shadow p-4 rounded-lg cursor-pointer" onClick={() => handleDelivery("intra_city")}>
          <div>
            <Image src="/images/icons/bike.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">Intra City Delivery</h1>
            <p>Send your parcel within your city. Same day deliveries in your town.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 shadow p-4 rounded-lg cursor-pointer" onClick={() => handleDelivery("inter_county")}>
          <div>
            <Image src="/images/icons/truck.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">Inter County Delivery</h1>
            <p>Send your parcel from one town to another. Deliveries can take 1 day or more.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 shadow p-4 rounded-lg cursor-pointer" onClick={() => handleDelivery("international")}>
          <div>
            <Image src="/images/icons/plane.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">International Delivery</h1>
            <p>Send your parcel out of Kenya to another country.</p>
          </div>
        </div>
      </div>


      {/* { TODO LIST LATEST PACKAGES} */}


      <div className="w-full py-10 bg-orange-400 md:px-30 px-12 max-lg:hidden">
        <div className="w-full pb-8">
          <h1 className="text-center font-bold text-white text-xl">Why you will love us</h1>
          <p className="w-[60%] mx-auto text-center text-white">At Expa we promise that we shall provide our clients with a competitive advantage, by providing excellence in delivery functionality to meet your needs.</p>
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
          <div className="flex flex-col shadow p-5 rounded bg-slate-50">
            <Image src="/icons/1.png" alt="EXPA" width={60} height={60} />
            <h1 className="text-orange-600 pt-4 font-bold">Careful Handling</h1>
            <p>At ExPa your parcels are handled with personal care. We care about your shipment</p>
          </div>

          <div className="flex flex-col shadow p-5 rounded bg-slate-50">
            <Image src="/icons/2.png" alt="EXPA" width={60} height={60} />
            <h1 className="text-orange-600 pt-4 font-bold">Confidentiality & Security</h1>
            <p>You can trust the integrity of your goods with us. We value our customers privacy and space.</p>
          </div>

          <div className="flex flex-col shadow p-5 rounded bg-slate-50">
            <Image src="/icons/3.png" alt="EXPA" width={60} height={60} />
            <h1 className="text-orange-600 pt-4 font-bold">Regional Footprint</h1>
            <p>We are the ONLY courier company with the largest delivery footprint in Northern Kenya</p>
          </div>

          <div className="flex flex-col shadow p-5 rounded bg-slate-50">
            <Image src="/icons/4.png" alt="EXPA" width={60} height={60} />
            <h1 className="text-orange-600 pt-4 font-bold">We go the extra mile</h1>
            <p>Not only do we handle every goods with detail, we also maintain regular communication with you until your goods reach their destination.</p>
          </div>
        </div>
      </div>


      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 md:px-30 px-12 py-10">
        <div>
          <h1 className='font-bold text-2xl text-orange-600'>Full Load Services</h1>
        </div>
        <div className="shadow-xl rounded-2xl p-6">
          <h4 className='font-semibold text-lg'>Calculate Our Rates</h4>
          <h6 className='text-slate-500'>Get our rates for either a van or truck.</h6>

          <div className='pt-8 w-full'>
            <FullLoadsForm />
          </div>
        </div>
      </div>




      <div className="w-full pt-10 md:px-30 px-12 max-lg:hidden">
        <h1 className="text-center font-bold text-orange-600 text-xl">Frequently Asked Questions</h1>
        <p className="text-center text-slate-500">Common Questions abour shipping delivery and courier services</p>

        <div className="pt-4 w-[90%] mx-auto">
          <FAQS />
        </div>

      </div>

    </section>
  )
}




export default ClientPage