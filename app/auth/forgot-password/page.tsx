"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
    email: z.string().email("Email is required"),
})

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async() => {

    }

    return (
        <section className="md:w-[60%] w-[90%]">
            <Card className=''>
                <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className="flex flex-col items-center justify-center ">
                        <Image src="/icons/auth.png" className="" width={400} height={100} alt="" />
                        <div className="flex flex-col py-6 md:block max-md:hidden">
                            <h1 className='text-center text-xl text-primary font-bold pb-1'>Welcome Back To ExPa</h1>
                            <p className="text-center">Fast, reliable deliveries at your fingertips. Sign in or create an account to begin.</p>
                        </div>
                    </div>
                    <div>
                        <CardTitle className='text-lg text-primary font-bold'>Forgot Password?</CardTitle>
                        <CardDescription className='mb-4'>Submit your email to get reset password link.</CardDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    className='bg-white'
                                                    placeholder='Your email address'
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className='w-full'>
                                    <Button disabled={!isValid || isSubmitting} className="bg-primary text-white w-full cursor-pointer">{loading ? "Authenticating ..." : "Reset Password"}</Button>
                                </div>
                            </form>
                        </Form>

                        <p className='flex flex-row pt-5'>Have an account? <Link className='text-primary ps-1' href="/auth/login"> Login</Link></p>
                    </div>
                </CardContent>

            </Card>
        </section>
    );
}

export default ForgotPasswordPage