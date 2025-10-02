"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormItem, FormControl, FormMessage, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeClosed } from 'lucide-react';
import { userRegistration } from '@/lib/utils/auth_services';
import { toast } from 'sonner';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from 'next/image';


const formSchema = z.object({
    fullname: z.string().min(1, { message: "Full Name is required"}),
    email: z.string().min(1, { message: "Email is required" }),
    phone: z.string().min(1, { message: "Phone Number is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters"}),
})

const RegistrationPage = () => {

    const router = useRouter();
    const [ passwordType, setPasswordType ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            email: "",
            phone: "",
            password: "",
        }
    });

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {

        setLoading(true);

        const formData = new FormData();
        formData.append("full_name", values.fullname);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("password", values.password);
        formData.append("role", "client");

        try{
            const data = await userRegistration(formData);
            console.log(data)
            if(data.success){
                toast.success("Registration successful!", { position: "top-center" });
                setLoading(false);
            } else {
                toast.error("An error occurred!", { position: "top-center" });
                setLoading(false);
            }
        } catch(e){
            setLoading(false);
        }
    }

    return (
            <section className="md:w-[70%] w-[90%]">
                <Card className=''>
                    
                    <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className="flex flex-col items-center justify-center ">
                            <Image src="/icons/auth.png" className="" width={400} height={100} alt="" />
                            <div className="flex flex-col py-6 md:block max-md:hidden">
                                <h1 className='text-center text-xl text-primary font-bold pb-5'>Welcome To Express Parcel - ExPa</h1>
                                <p className="text-center">Fast, reliable deliveries at your fingertips. Sign in or create an account to begin.</p>
                            </div>
                        </div>

                        <div>
                            <CardTitle className='text-lg text-primary font-bold'>Register</CardTitle>
                            <CardDescription className='mb-4'>Fill all the form fields below.</CardDescription>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                                    <FormField
                                        control={form.control}
                                        name="fullname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        className='bg-white'
                                                        placeholder='Your full name'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        className='bg-white'
                                                        placeholder='Your email address'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <PhoneInput 
                                                        international
                                                        defaultCountry="KE"
                                                        className="border rounded-lg px-3 py-2"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={passwordType ? "text" : "password"}
                                                            className='bg-white'
                                                            placeholder='********'
                                                            {...field}
                                                        />
                                                        <div className="absolute z-50 right-3 top-3" onClick={() => setPasswordType((prev) => !prev)}>
                                                            {passwordType ? <><Eye className="w-4 h-4 text-slate-500" /></> : <><EyeClosed className="w-4 h-4  text-slate-500" /></>}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='w-full'>
                                    <Button disabled={!isValid || isSubmitting} className="bg-primary text-white w-full cursor-pointer">{loading ? "Authenticating ...." : "Register"}</Button>
                                    </div>
                                </form>
                            </Form>

                            <p className='flex flex-row pt-5'>Already having account? <Link className='text-primary ps-1' href="/auth/login"> Log in</Link></p>
                        </div>
                    </CardContent>

                </Card>
            </section>
        )
}

export default RegistrationPage