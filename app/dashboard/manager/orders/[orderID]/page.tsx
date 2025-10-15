"use client";

import ConfirmPaymentsModal from '@/components/modals/confirm_payments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackageModel } from '@/lib/models/all_models';
import { cn } from '@/lib/utils';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const OrderDetailsPage = () => {
    const {data:session } = useSession();
    const params = useParams();
    const [packageData, setPackageData]= useState<PackageModel>();

    useEffect(() => {
        const fetchData = async() => {
            if (!session?.accessToken){
                throw new Error("You must be logged in.");
            }

            const res = await APIServices.get(`deliveries/manager/package_details/${params.orderID}/`, session?.accessToken);
            console.log(res);
            setPackageData(res);
        }
        fetchData();
    }, [session, params]);

  return (
    <section>
        <div className='grid md:grid-cols-3 grid-cols-1 gap-5'>
            <div>
                <h1 className='font-semibold text-xl text-primary'>{packageData?.package_id}</h1>
                <p className='pt-2 text-sm'>Created on {new Date(packageData?.created_at).toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric"})}</p>

                
            </div>
            <div className='space-y-1'>
                <div>
                    <h1>Status</h1>
                    <p className={cn('capitalize', packageData?.status === 'pending' ? 'text-red-600' : 'text-green-600')}>{packageData?.status}</p>
                </div>
            </div>
            <div className='space-y-1'>
                {packageData?.is_paid ? (
                    <p>Paid</p>
                ) : (
                    <ConfirmPaymentsModal title='Confirm Payments' subtitle={packageData?.package_id}>
                        <section className='space-y-3'>
                            <div className='space-y-2'>
                                <Label>MPESA Code</Label>
                                <Input type="text" placeholder='e.g. TGN37SYZ6N' />
                            </div>
                            <Button className='w-full bg-primary cursor-pointer'>Confirm Payments</Button>
                        </section>
                    </ConfirmPaymentsModal>
                )}
            </div>
        </div>

        <section className='pt-8'>
            <h1 className='font-semibold pb-3 text-primary'>More Details</h1>
            <div className='grid md:grid-cols-5 grid-cols-1 gap-5'>
                <div>
                    <h1><span className='text-xs'>Delivery Type</span></h1>
                    <h1 className='capitalize'>{packageData?.delivery_type.replace("_", " ")}</h1>
                </div>
                <div>
                    <h1><span className='text-xs'>Size Category</span></h1>
                    <h1 className='capitalize'>{packageData?.size_category_name}</h1>
                </div>
                
                <div>
                    <h1><span className='text-xs'>Fragile?</span></h1>
                    <h1 className='capitalize'>{packageData?.is_fragile ? "Yes" : "No"}</h1>
                </div>

                {packageData?.length && (
                    <div>
                        <h1><span className='text-xs'>Length</span></h1>
                        <h1 className='capitalize'>{packageData?.length}cm</h1>
                    </div>
                )}
                {packageData?.width && (
                    <div>
                        <h1><span className='text-xs'>Width</span></h1>
                        <h1 className='capitalize'>{packageData?.width}cm</h1>
                    </div>
                )}
                {packageData?.height && (
                    <div>
                        <h1><span className='text-xs'>Height</span></h1>
                        <h1 className='capitalize'>{packageData?.height}cm</h1>
                    </div>
                )}
                {packageData?.weight && (
                    <div>
                        <h1><span className='text-xs'>Weight</span></h1>
                        <h1 className='capitalize'>{packageData?.weight}kgs</h1>
                    </div>
                )}
            </div>
            <div className='pt-4'>
                <h1><span className='text-xs'>Description</span></h1>
                <h1 className=''>{packageData?.description}</h1>
            </div>
        </section>

        <section className='grid md:grid-cols-2 grid-cols-1 pt-6 gap-5'>
            <div>
                <h1 className='text-primary font-semibold'>Sender Details</h1>
                <h1 className='capitalize'>{packageData?.created_by_role}</h1>
                <h1>{packageData?.sender_name}</h1>
                <h1>{packageData?.sender_phone}</h1>
                <h1>{packageData?.sender_address}</h1>
            </div>
            <div>
                <h1 className='text-primary font-semibold'>Recipient Details</h1>
                <h1>{packageData?.recipient_name}</h1>
                <h1>{packageData?.recipient_phone}</h1>
                <h1>{packageData?.recipient_address}</h1>
            </div>
        </section>
    </section>
  )
}

export default OrderDetailsPage