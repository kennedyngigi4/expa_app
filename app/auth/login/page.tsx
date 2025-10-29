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
import { toast } from 'sonner';
import { userLogin } from '@/lib/utils/auth_services';
import { useSession, getSession } from 'next-auth/react';
import Image from 'next/image';


const formSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters"}),
})

const LoginPage = () => {

    const router = useRouter();
    const [ passwordType, setPasswordType ] = useState(false); 
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        setLoading(true);

        try{
            
            const res = await userLogin(values.email, values.password);
            
            if (res.success){
                const session = await getSession();
                const role = session?.user?.role;
                
                toast.success("Logging in", { position: "top-center" });
                setLoading(false);
                

                switch(role){
                    case "admin":
                        router.push("/dashboard/admin");
                        break;
                    case "manager":
                        router.push("/dashboard/manager");
                        break;
                    case "partner_shop":
                        router.push("/dashboard/partner");
                        break;
                    // case "partner_rider":
                    //     router.push("/confirm");
                    //     break;
                    // case "driver":
                    //     router.push("/confirm");
                    //     break;
                    default:
                        router.push("/");
                        break;
                }

            } else {
                toast.error(res.message, { position: "top-center" });
                setLoading(false);
            }
        } catch(e){
            toast.error("An error occurred!", { position: "top-center"});
            setLoading(false);
        }
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
                        <CardTitle className='text-lg text-primary font-bold'>Login</CardTitle>
                        <CardDescription className='mb-4'>Fill all the form fields below.</CardDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
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
                                                <div className='relative'>
                                                    <Input
                                                        type={ passwordType ? "text" : "password" }
                                                        className='bg-white'
                                                        placeholder='********'
                                                        {...field}
                                                    />
                                                    <div className="absolute z-50 right-3 top-3" onClick={() => setPasswordType((prev) => !prev)}>
                                                        {passwordType ? <><Eye className="w-4 h-4 text-slate-500" /></> : <><EyeClosed className="w-4 h-4  text-slate-500" /></>}
                                                    </div>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />


                                <div className='w-full text-end'>
                                    <Link className="text-xs text-orange-500" href="/auth/forgot-password">Forgot Password?</Link>
                                </div>

                                <div className='w-full'>
                                    <Button disabled={!isValid || isSubmitting} className="bg-primary text-white w-full cursor-pointer">{loading ? "Authenticating ..." : "Log In"}</Button>
                                </div>
                            </form>
                        </Form>

                        <p className='flex flex-row pt-5'>No registered? <Link className='text-primary ps-1' href="/auth/registration"> Register</Link></p>
                    </div>
                </CardContent>
                
            </Card>
        </section>
    );
}

export default LoginPage