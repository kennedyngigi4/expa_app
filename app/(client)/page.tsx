"use client"

import { useSession } from 'next-auth/react'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FAQS from '../_components/faqs';
import FullLoadsForm from './_components/full-loads-form';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ClientPage = () => {

  const { data:session } = useSession();
  const router = useRouter();

  const handleDelivery = async (value: string) => {
    sessionStorage.setItem("deliveryType", value);
    router.push("/create_package");
  }

  return (
    <section className="flex flex-col">

      <div className="bg-orange-100 flex md:flex-row flex-col justify-between items-center px-12 md:px-30 md:h-[300px] overflow-hidden">
        <div className="flex-1 py-5">
          <h1 className="font-bold">Welcome back {session?.user?.name}!</h1>

          <div className="pt-15">
            <h1 className="font-bold text-2xl">Get Your Things Delivered</h1>
            <p>Anything. Anytime. Anywhere ...</p>
          </div>
        </div>

        
        <div className="relative flex-1 h-full overflow-hidden max-md:hidden">
          <Image
            src="/icons/avatar.png"
            alt="EXPA"
            fill
            className="object-contain md:object-right"
            priority
          />
        </div>
      </div>



      <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-4 py-8 md:px-30 px-12">
        <div className="grid grid-cols-1 shadow p-4 rounded-lg cursor-pointer bg-orange-100" onClick={() => handleDelivery("intra_city")}>
          <div>
            <Image src="/images/icons/bike.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">Intra City Delivery</h1>
            <p>Send your parcel within your city. Same day deliveries in your town.</p>

            <Link href="#" className="flex flex-row items-center py-3 text-sm">Get started <ArrowRight className='ps-1' size={20} /></Link>
          </div>
        </div>
        <div className="grid grid-cols-1 shadow p-4 rounded-lg cursor-pointer bg-orange-100" onClick={() => handleDelivery("inter_county")}>
          <div>
            <Image src="/images/icons/truck.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">Inter County Delivery</h1>
            <p>Send your parcel from one county to another county. Deliveries can take 1 day or more.</p>

            <Link href="#" className="flex flex-row items-center py-3 text-sm">Get started <ArrowRight className='ps-1' size={20} /></Link>
          </div>
        </div>
        <div className="grid grid-cols-1 shadow p-4 rounded-lg cursor-pointer bg-orange-100" onClick={() => handleDelivery("international")}>
          <div>
            <Image src="/images/icons/plane.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">International Delivery</h1>
            <p>Send your parcel out of Kenya to another country.</p>

            <Link href="#" className="flex flex-row items-center py-3 text-sm">Get started <ArrowRight className='ps-1' size={20} /></Link>
          </div>
        </div>
      </div>


      


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


      <div className="grid md:grid-cols-2 grid-cols-1 md:px-30 px-12 py-10">
        <div className='relative shadow rounded-l-2xl p-6'>
          <Image
            src="/images/others/fullload.jpg"
            alt="EXPA"
            fill
            className="object-cover md:object-center"
            priority
          />
        </div>
        <div className="shadow rounded-r-2xl p-6">
          <h1 className='font-bold text-2xl text-orange-600'>Full Load Services</h1>
          <h4 className='font-semibold text-lg'>Calculate Our Rates</h4>
          <h6 className='text-slate-500'>Get our rates for either a van or truck.</h6>

          <div className='pt-8 w-full'>
            <FullLoadsForm />
          </div>
        </div>
      </div>




      <div className="w-full pt-5 pb-16 md:px-14 px-12 max-lg:hidden">
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