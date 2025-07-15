"use client";

import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { APIServices } from '@/lib/utils/api_services';
import { useRouter } from 'next/navigation';


const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required."}),
    phone: z.string().min(1, { message: "Phone number is required." }),
    email: z.string().min(1, { message: "Email address is required." }),
    address: z.string().min(1, { message: "Physical address is required." }),
    description: z.string().optional(),
})

const OfficeCreate = () => {

    const { data:session} = useSession();
    const router = useRouter();

    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            description: ""
        }
    });

    const { isValid, isSubmitting } = form.formState;


    const onSubmit = async(values: z.infer<typeof formSchema>) => {

        if(!session?.accessToken){
            throw new Error("You must be logged in.");
        }

        try{
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("phone", values.phone);
            formData.append("address", values.address);
            formData.append("geo_lat", "36.1232");
            formData.append("geo_lng", "1.2312");

            if(values.description){
                formData.append("description", values.description);
            }
            

            const res = await APIServices.post('account/superadmin/offices/', session?.accessToken, formData);
            if(res.ok){
                toast.success("Office added successfully.");
                router.push("/dashboard/admin/offices");
            } else {
                toast.error("An error occurred.");
                window.location.reload();
            }

        } catch(e){
            toast.error("Error "+e)
        }
    }

    return (
        <section className='md:w-[60%] mx-auto'>
            <div className='flex flex-col pb-8'>
                <h1 className='font-semibold text-xl text-primary'>Add Office</h1>
                <p className='text-slate-500'>Fill all required form fields.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <FormField 
                        name="name"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Office Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        type='text' 
                                        className='bg-white'
                                        placeholder='e.g. Nairobi main office'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div>
                            <FormField
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Office Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='tel'
                                                className='bg-white'
                                                placeholder='e.g. 254722...'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Office Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                className='bg-white'
                                                placeholder='e.g. nairobi@expa.co.ke'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        name="address"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Office Physical Address</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className='bg-white'
                                        placeholder='e.g. Eastleigh, Nairobi, Kenya'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder='Enter description here ....'></Textarea>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <Button className='cursor-pointer' disabled={!isValid || isSubmitting}>Submit</Button>
                    </div>
                </form>
            </Form>
        </section>
    );
}

export default OfficeCreate