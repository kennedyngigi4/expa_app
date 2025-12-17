"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel, FormDescription } from '@/components/ui/form';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PhoneInput from "react-phone-number-input";
import Link from 'next/link';
import { APIServices } from '@/lib/utils/api_services';
import { toast } from 'sonner';


const formSchema = z.object({
    name: z.string().min(1, "Enter package name."),
    country: z.string().min(1, "Country is required."),
    city: z.string().min(1, "City is required."),
    is_fragile: z.string().min(1, "Required."),
    weight: z.string().min(1, "Weight is required."),
    recipient_name: z.string().min(1, "Recipient name is required."),
    recipient_phone: z.string().min(1, "Recipient phone is required."),
    recipient_email: z.string().min(1, "Recipient email is required."),
    description: z.string().optional(),
    mpesaphone: z.string().min(1, "Mpesa payment number is required.")
})

const InternationalForm = () => {
    const {data:session} = useSession();
    const [countries, setCountries ] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [cities, setCities] = useState<any[]>([]);
    const [quote, setQuote] = useState<any>({});

    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country: "",
            city: "",
            is_fragile: "",
            weight: "",
            recipient_name: "",
            recipient_phone: "",
            recipient_email: "",
            description: "",
            mpesaphone: "",
        }
    });
    const { watch } = form;
    const { isSubmitting, isValid } = form.formState;

    const country = watch("country");
    const city = watch("city");
    const weight = watch("weight");


    useEffect(() => {
        const fetchCountries = async() => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/international/countries/`);
            const resp = await response.json();
            setCountries(resp);
            
        }
        fetchCountries();
    }, [])


    useEffect(() => {
        if(!selectedCountry){
            setCities([]);
            return;
        }

        const fetchCities = async() => {
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/international/cities/${selectedCountry}/`);
                const resp = await response.json();
                
                setCities(resp);
            } catch(e){
                setCities([]);
            }
        }

        fetchCities();
    }, [selectedCountry]);



    useEffect(() => {
        if(!country || !city || !weight){
            return;
        }

        const controller = new AbortController()

        const fetchQuote = async() => {

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/international/pricing/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({
                        country, city, weight,
                    }),
                    signal: controller.signal,
                });

                const data = await res.json();
                
                if (data.success) {
                    setQuote(data)
                }
            } catch(err) {
                if (err.name !== "AbortError") {
                    console.error("Pricing error", err)
                }
            }
            
        }

        fetchQuote();
        return () => controller.abort()
    }, [country, city, weight]);


    const onSubmit = async(values: z.infer<typeof formSchema>) => {

        if (!session?.accessToken) {
            throw new Error("You must be logged in.");
        }

        

        try{
            
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("city", values.city);
            formData.append("is_fragile", values.is_fragile);
            formData.append("weight", values.weight);
            formData.append("recipient_name", values.recipient_name);
            formData.append("recipient_phone", values.recipient_phone);
            formData.append("recipient_email", values.recipient_email);
            formData.append("description", values.description);
            formData.append("mpesaphone", values.mpesaphone);

            formData.append("sender_name", session?.user.name);
            formData.append("sender_phone", session?.user.phone);
            formData.append("price", quote.total_fee);

            const res = await APIServices.post("international/add_order/", session?.accessToken, formData);
            if(res.success){
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        } catch(e){
            console.log(e);
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4 mb-10">

                <div className="grid md:grid-cols-12 grid-cols-1 gap-5">
                    <div className="col-span-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Package Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="text"
                                            placeholder="e.g. 'Pair of shoes', 'Kids clothes' ...."
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-4">
                        <FormField
                            control={form.control}
                            name="is_fragile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fragile?</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Choose option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="false">No</SelectItem>
                                                <SelectItem value="true">Yes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(value) => { field.onChange(value), setSelectedCountry(value), form.setValue("city", "") }} defaultValue={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries?.map((country: any) => (
                                                    <SelectItem key={country.id} value={String(country.id)}>{country.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Choose city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities?.map((city: any) => (
                                                    <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-12 grid-cols-1 gap-5">
                    <div className='col-span-2'>
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (kgs)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="e.g. 2.1"
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-4'>
                        <FormField
                            control={form.control}
                            name="recipient_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-3'>
                        <FormField
                            control={form.control}
                            name="recipient_phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder=""
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-3'>
                        <FormField
                            control={form.control}
                            name="recipient_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="e.g. johndoe@email.xyz"
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter description here ...." className="bg-white" {...field}></Textarea>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                {quote.success && (
                    <div className="py-4">
                        <h1 className="font-semibold text-orange-400">Payments</h1>
                        <h1>Amount to pay: <span className="font-semibold">KES {parseInt(quote.total_fee).toLocaleString()}</span></h1>

                        <div className="py-6 w-[400px]">
                            <FormField
                                control={form.control}
                                name="mpesaphone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mpesa number</FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                international
                                                defaultCountry="KE"
                                                className="border rounded-lg px-3 py-2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>MPesa number used for payments.</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex space-x-5">
                            <Link href="/packages"><Button variant="ghost" type="button" className='cursor-pointer'><ArrowLeft /> Back</Button></Link>
                            <Button className="cursor-pointer" type="button" onClick={form.handleSubmit(onSubmit)}>Submit</Button>
                        </div>
                    </div>
                )}
                
            </form>
        </Form>
    )
}

export default InternationalForm