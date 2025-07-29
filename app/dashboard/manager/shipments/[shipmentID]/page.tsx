"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { APIServices } from '@/lib/utils/api_services';
import { PackageModel, ShipmentModel } from '@/lib/models/all_models';
import { useSession } from 'next-auth/react';
import Image from 'next/image';


const ShipmentDetailsPage = () => {
    const params = useParams();
    const {data:session} = useSession();
    const [shipmentData, setShipmentData] = useState<ShipmentModel>();

    useEffect(() => {

        const fetchData = async() => {

            if(!session?.accessToken){
                throw new Error("You must be logged in.")
            }

            const res = await APIServices.get(`deliveries/manager/shipment_details/${params.shipmentID}/`, session?.accessToken);
            console.log(res);
            setShipmentData(res);
        }
        fetchData();
    }, [session, params]);

    return (
        <section>
            <div className='grid md:grid-cols-3 grid-cols-1'>
                <div>
                    <h1 className='text-lg font-bold'>{shipmentData?.shipment_id}</h1>
                    <div className='space-y-2.5 pt-3'>
                        <p className='capitalize'>{shipmentData?.status}</p>
                        <p>{new Date(shipmentData?.assigned_at).toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric"})}</p>
                    </div>
                </div>
                <div className='pt-4 space-y-2'>
                    <h1 className='font-semibold text-primary'>Details</h1>
                    <h1 className='capitalize'><span className='font-bold'>Type:</span> {shipmentData?.shipment_type}</h1>
                    <h1><span className='font-bold'>Summary:</span> {shipmentData?.summary}</h1>
                    <h1><span className='font-bold'>Packages:</span> {shipmentData?.packages?.length}</h1>
                    <h1><span className='font-bold'>Stages:</span> {shipmentData?.stages?.length}</h1>
                </div>
                <div>
                    {shipmentData?.qrcode_svg && (
                        <Image src={shipmentData?.qrcode_svg} className='' width={250} height={250} alt="QR Code" />
                    )}
                </div>
            </div>


            <div>
               <h1 className='text-primary font-semibold pb-5 text-lg'>Packages</h1>
               {shipmentData?.packages?.map((data: any) => (
                <div className="grid md:grid-cols-5 grid-cols-1 pb-5" key={data.package?.id || Math.random()}>
                    <p><span className='font-semibold text-sm'>Package ID</span>:<br /> {data.package?.package_id}</p>
                    <p><span className='font-semibold text-sm'>Status:</span> <br /> {data.status}</p>
                    <p><span className='font-semibold text-sm'>Delivered:</span> <br /> {data.delivered ? 'Yes' : 'No'}</p>
                    <p><span className='font-semibold text-sm'>Sender:</span> <br /> {data.package?.sender_name}</p>
                    <p><span className='font-semibold text-sm'>Destination:</span> <br /> {data.package?.recipient_address}</p>
                </div>
               ))}
            </div>


            <div className='py-8'>
                <h1 className='text-primary font-semibold pb-5 text-lg'>Stages</h1>
                {shipmentData?.stages?.map((data: any) => (
                    <div className="grid md:grid-cols-5 grid-cols-1 pb-5" key={data?.id || Math.random()}>
                        <p><span className='font-semibold text-sm'>Driver</span>:<br /> {data.status}</p>
                        <p><span className='font-semibold text-sm'>Stage</span>:<br /> {data.stage_number}</p>
                        <p><span className='font-semibold text-sm'>Driver</span>:<br /> {data.driver}</p>
                        <p><span className='font-semibold text-sm'>Assigned At</span>:<br /> {new Date(data.created_at).toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric"})}</p>
                    </div>
                ))}
            </div>

        </section>
    );
}

export default ShipmentDetailsPage