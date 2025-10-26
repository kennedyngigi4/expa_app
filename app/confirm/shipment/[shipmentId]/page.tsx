"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';


const formSchema = z.object({
    status: z.string().min(1, "Field is required"),
    identity_number: z.string().min(1, "Field is required"),
    name: z.string().min(1, "Field is required"),
    note: z.string().min(1, "Field is required"),
})

const ConfirmShipment = () => {

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

    const onSubmit = async() => {

    }

    return (
        <section className='flex flex-col min-h-screen items-center justify-center'>
            <div className="w-[60%] p-10 shadow-2xl">
                <div className='pb-10'>
                    <h1 className='font-bold  text-2xl'>Confirm Shipment Delivery</h1>
                    <p>ID: </p>
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
                                            <Select>
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
                            <Button>Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    )
}

export default ConfirmShipment