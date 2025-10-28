"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { APIServices } from '@/lib/utils/api_services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';


const formSchema = z.object({
    status: z.string().min(1, "Field is required"),
    identity_number: z.string().min(1, "Field is required"),
    name: z.string().min(1, "Field is required"),
    note: z.string().min(1, "Field is required"),
})

const ConfirmOrder = () => {
    const params = useParams();
    const orderId = params.orderId;

    const {data:session} = useSession();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "",
            identity_number: "",
            name: "",
            note: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        console.log(values);
        if(!session?.accessToken) return;

        const formData = new FormData();
        formData.append("status", values.status);
        formData.append("identity_number", values.identity_number);
        formData.append("name", values.name);
        formData.append("note", values.note);

        const resp = await APIServices.post(`deliveries/drivers/shipments/${orderId}/proofs/`, session?.accessToken, formData);
        if(resp.success){
            toast.success("Proof submitted successfully.");
        } else {
            toast.error("An error occured");
        }
    }

    return (
        <section className='flex flex-col min-h-screen items-center justify-center'>
            <div className="md:w-[60%] w-[90%] p-10 shadow-2xl">
                <div className='pb-10'>
                    <h1 className='font-bold  text-2xl'>Confirm Order Delivery</h1>
                    <p>ID: {orderId}</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                        <div>
                            <FormField
                                name="status"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Choose option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='delivered'>Delivered</SelectItem>
                                                    <SelectItem value='not delivered'>Not Delivered</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Recipient name"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div>
                            <FormField
                                name="identity_number"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient ID/Passport Number</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                placeholder="Recipient ID/Passport Number"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>



                        <div>
                            <FormField
                                name="note"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Leave a note"></Textarea>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <Button className='cursor-pointer'>Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    )
}

export default ConfirmOrder