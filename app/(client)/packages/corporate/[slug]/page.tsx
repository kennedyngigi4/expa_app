"use client";

import ConfirmPaymentsModal from '@/components/modals/confirm_payments';
import { PackageModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { File } from 'lucide-react';

const CorporatePackageDetails = () => {
  const { data: session } = useSession();
  const params = useParams();
  const [packageData, setPackageData] = useState<PackageModel>();


  useEffect(() => {
    const fetchData = async () => {

      if (!session?.accessToken) {
        throw new Error("You must be logged in.");
      }

      const res = await APIServices.get(`corporate/order_details/${params.slug}/`, session?.accessToken);
      console.log(res);
      setPackageData(res.data);
    }
    fetchData();
  }, [params, session]);

  return (
    <section className='flex flex-col space-y-10 md:px-20 px-5 pb-14'>
      <div className='grid md:grid-cols-3 grid-cols-1 gap-8 py-8'>
        <div>
          <h1 className='text-primary font-semibold text-2xl'>{packageData?.package_id}</h1>
          <h1 className="text-slate-500 capitalize">{packageData?.size_category_name}</h1>
        </div>
        <div>
          <h1 className='text-lg text-slate-500'>Status</h1>
          <h1 className='uppercase'>{packageData?.status}</h1>
        </div>
        <div>
          {packageData?.is_paid ? (
            <>Paid</>
          ) : (
            <>
              <p>KES {parseFloat(packageData?.fees).toLocaleString(undefined, { maximumFractionDigits: 2})}</p>
            </>
            
          )}
          <h1 className='text-red-500 pt-5'>Cancel Order</h1>
        </div>
      </div>

      <div>
        <h1 className='text-primary font-semibold pb-1'>More Details</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 border border-gray-100">
          <div className='border border-gray-100 p-4'>
            <h1 className="text-slate-500">Package Name</h1>
            <p>{packageData?.name}</p>
          </div>
          <div className='border border-gray-100 p-4'>
            <h1 className="text-slate-500">Delivery Type</h1>
            <p className='capitalize'>{packageData?.delivery_type.replace("_", " ")}</p>
          </div>
          <div className='border border-gray-100 p-4'>
            <h1 className="text-slate-500">Package Type</h1>
            <p className='capitalize'>{packageData?.package_type_name}</p>
          </div>
          <div className='border border-gray-100 p-4'>
            <h1 className="text-slate-500">Fragile</h1>
            <p>{packageData?.is_fragile ? (<>Not Fragile</>) : (<>Fragile</>)}</p>
          </div>
          <div className='border border-gray-100 p-4'>
            <h1 className="text-slate-500">Urgency</h1>
            <p>{packageData?.urgency_name}</p>
          </div>
          {packageData?.length && (
            <div className='border border-gray-100 p-4'>
              <h1 className="text-slate-500">Length (cm)</h1>
              <p>{packageData?.length}</p>
            </div>
          )}
          {packageData?.width && (
            <div className='border border-gray-100 p-4'>
              <h1 className="text-slate-500">Width (cm)</h1>
              <p>{packageData?.width}</p>
            </div>
          )}
          {packageData?.height && (
            <div className='border border-gray-100 p-4'>
              <h1 className="text-slate-500">Height (cm)</h1>
              <p>{packageData?.height}</p>
            </div>
          )}
          {packageData?.weight && (
            <div className='border border-gray-100 p-4'>
              <h1 className="text-slate-500">Weight (kgs)</h1>
              <p>{packageData?.weight}</p>
            </div>
          )}
        </div>
      </div>

      <div className='grid md:grid-cols-2 grid-cols-1 gap-8'>
        <div className=''>
          <h1 className='text-primary font-semibold pb-1'>Package Items</h1>
          {packageData?.package_items?.map((item: any) => (
            <div className="grid md:grid-cols-3 grid-cols-1 border-b border-slate-100 pb-3" key={item.name}>
              <div>
                <p className='text-slate-400 text-sm'>Name</p>
                <p>{item?.name}</p>
              </div>
              <div>
                <p className='text-slate-400 text-sm'>Weight</p>
                <p>{item?.weight}</p>
              </div>
              <div>
                <p className='text-slate-400 text-sm'>Description</p>
                <p>{item?.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h1 className='text-primary font-semibold pb-2'>Package Attachments</h1>
          {packageData?.package_attachments?.map((item: any, index: number) => (
            <div className='flex flex-col pb-3' key={item.id}>
              <a href={item?.attachment} target="_blank" download>
                <p className='text-slate-400 text-sm flex'><File size={16} /> {item?.attachment.split("/").pop()}</p>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className='text-primary font-semibold pb-1'>Delivery Details</h1>
        <div className="grid md:grid-cols-2 grid-cols-1 border border-gray-100">
          <div className="border border-gray-100 p-4">
            <h1 className='text-slate-500 font-semibold text-lg'>From</h1>
            <h1>{packageData?.sender_name}</h1>
            <h1>{packageData?.sender_phone}</h1>
            <h1>{packageData?.sender_address}</h1>
          </div>
          <div className="border border-gray-100 p-4">
            <h1 className='text-slate-500 font-semibold text-lg'>To</h1>
            <h1>{packageData?.recipient_name}</h1>
            <h1>{packageData?.recipient_phone}</h1>
            <h1>{packageData?.recipient_address}</h1>
          </div>
        </div>
      </div>



    </section>
  )
}

export default CorporatePackageDetails