"use client";

import ConfirmPaymentsModal from '@/components/modals/confirm_payments';
import { PackageModel } from '@/lib/models/all_models';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PackageDetailsSlug = () => {
    const { data:session } = useSession();
    const params = useParams();
    const [ packageData, setPackageData ] = useState<PackageModel>();


    useEffect(() => {
        const fetchData = async() => {

            if (!session?.accessToken){
                throw new Error("You must be logged in.");
            }

            const res = await APIServices.get(`deliveries/user_package_details/${params.packageSlug}/`, session?.accessToken);
            
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
                        <ConfirmPaymentsModal title='Confirm Payments' subtitle={`${packageData?.package_id}`}>
                            <div>
                                <p>Form here ....</p>
                            </div>
                        </ConfirmPaymentsModal>
                    )}
                    <h1 className='text-red-500 pt-5'>Cancel Order</h1>
                </div>
            </div>

            <div>
                <h1 className='text-primary font-semibold pb-1'>More Details</h1>
                <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8'>
                    <div className='pb-2'>
                        <h1 className="text-slate-500">Package Name</h1>
                        <p>{packageData?.name}</p>
                    </div>
                    <div className='pb-2'>
                        <h1 className="text-slate-500">Delivery Type</h1>
                        <p className='capitalize'>{packageData?.delivery_type.replace("_", " ")}</p>
                    </div>
                    <div className='pb-2'>
                        <h1 className="text-slate-500">Package Type</h1>
                        <p className='capitalize'>{packageData?.package_type_name}</p>
                    </div>
                    <div className='pb-2'>
                        <h1 className="text-slate-500">Fragile</h1>
                        <p>{packageData?.is_fragile ? (<>Not Fragile</>) : (<>Fragile</>)}</p>
                    </div>
                    <div className='pb-2'>
                        <h1 className="text-slate-500">Urgency</h1>
                        <p>{packageData?.urgency_name}</p>
                    </div>
                    {packageData?.length && (
                        <div className='pb-2'>
                            <h1 className="text-slate-500">Length (cm)</h1>
                            <p>{packageData?.length}</p>
                        </div>
                    )}
                    {packageData?.width && (
                        <div className='pb-2'>
                            <h1 className="text-slate-500">Width (cm)</h1>
                            <p>{packageData?.width}</p>
                        </div>
                    )}
                    {packageData?.height && (
                        <div className='pb-2'>
                            <h1 className="text-slate-500">Height (cm)</h1>
                            <p>{packageData?.height}</p>
                        </div>
                    )}
                    {packageData?.weight && (
                        <div className='pb-2'>
                            <h1 className="text-slate-500">Weight (kgs)</h1>
                            <p>{packageData?.weight}</p>
                        </div>
                    )}
                </div>
            </div>


            <div>
                <h1 className='text-primary font-semibold pb-1'>Delivery Details</h1>
                <div className='grid lg:grid-cols-2 grid-cols-1 gap-8'>
                    <div>
                        <h1 className='text-slate-500 font-semibold text-lg'>From</h1>
                        <h1>{packageData?.sender_name}</h1>
                        <h1>{packageData?.sender_phone}</h1>
                        <h1>{packageData?.sender_address}</h1>
                    </div>
                    <div>
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

export default PackageDetailsSlug