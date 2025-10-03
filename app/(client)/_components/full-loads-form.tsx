"use client";

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationSearch from '@/components/ui/location-search';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";



const fullLoadSchema = z.object({
    vehicle_type: z.string().min(1, "Vehicle type is required."),
    origin: z.string().min(1, "Origin is required."),
    origin_latLng: z.string(),
    destination: z.string().min(1, "Destination is required."),
    destination_latLng: z.string(),
    weight: z.string().min(1, "Weight is required."),
    mpesaphone: z.string().min(1, "MPesa number is required"),
});

const FullLoadsForm = () => {
    const {data:session} = useSession();
    const [ vehicleTypes, setVehicleTypes ] = useState<string[]>([]);
    const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
    const [distance, setDistance] = useState();
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            if (!session?.accessToken) return;
            const resp = await APIServices.get("fullloads/vehicle_types/", session?.accessToken);
            console.log(resp);
            setVehicleTypes(resp);
        }
        fetchData();
    },[session]);

    const form = useForm<z.infer <typeof fullLoadSchema>>({
        resolver: zodResolver(fullLoadSchema),
        defaultValues: {
            vehicle_type: "",
            origin: "",
            origin_latLng: "",
            destination: "",
            destination_latLng: "",
            weight: "",
            mpesaphone: "",
        }
    });
    const { isValid, isSubmitting } = form.formState;

    const { watch, setValue } = form;

    // watch fields
    const vehicle = watch("vehicle_type");
    const origin_latLng = watch("origin_latLng");
    const destination_latLng = watch("destination_latLng")
    const weight = watch("weight")



    // calculate price
    useEffect(() => {
        const calculate = async() => {
            if (!vehicle || !origin_latLng || !destination_latLng || !weight || !session?.accessToken) {
                setCalculatedPrice(null);
                return;
            }

            setLoadingPrice(true);
            try {
                const formData = new FormData();
                formData.append("vehicle", vehicle);
                formData.append("weight", weight);
                formData.append("origin_latLng", origin_latLng);
                formData.append("destination_latLng", destination_latLng);
               

                const resp = await APIServices.post("fullloads/price_calculator/", session.accessToken, formData);
                console.log(resp);
                if (!resp.success) {
                    toast.error(resp.message || "Failed to calculate price");
                }else if (resp?.success && resp.price) {
                    setCalculatedPrice(resp.price);
                    setDistance(resp.distance_km);
                } else {
                    setCalculatedPrice(null);
                }
            } catch (err) {
                console.error("Failed to calculate price:", err);
                setCalculatedPrice(null);
            }
            setLoadingPrice(false);
        }
        calculate();
    }, [vehicle, origin_latLng, destination_latLng, weight, session]);

    const onSubmit = async(values: z.infer<typeof fullLoadSchema>) => {
        setLoading(true);
        if (!session?.accessToken) return;

        const formData = new FormData();
        formData.append("vehicle", values.vehicle_type);
        formData.append("weight", values.weight);
        formData.append("pickup_address", values.origin);
        formData.append("pickup_latLng", values.origin_latLng);
        formData.append("dropoff_address", values.destination);
        formData.append("price", calculatedPrice?.toString());
        formData.append("distance", distance?.toString());
        formData.append("payment_phone", values.mpesaphone);

        const resp = await APIServices.post("fullloads/book-fullload/", session?.accessToken, formData);
        if(resp["success"]){
            toast.success(resp["message"]);
            window.location.reload();
            setLoading(false);
        } else {
            setLoading(false);
            toast.error("An error occured.");
        }
    }


    

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <FormField
                            name="vehicle_type"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vehicle</FormLabel>
                                    <Select value={String(field.value)} onValueChange={field.onChange}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Choose vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicleTypes.map((item: any) => (
                                                <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField 
                            name="origin"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Pick up location</FormLabel>
                                    <FormControl>
                                        <LocationSearch 
                                            value={field.value} 
                                            onChange={field.onChange} 
                                            onLatLngChange={(lat, lng) => { setValue("origin_latLng", `${lat.toString()},${lng.toString()}`) }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            name="destination"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination</FormLabel>
                                    <FormControl>
                                        <LocationSearch
                                            value={field.value}
                                            onChange={field.onChange}
                                            onLatLngChange={(lat, lng) => { setValue("destination_latLng", `${lat.toString()},${lng.toString()}`) }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            name="weight"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight <span className='text-xs'>(tons)</span></FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Price Preview */}
                    {calculatedPrice !== null && (
                        <div>
                            <div className="text-lg font-semibold text-orange-600">
                                Estimated Price: KES {calculatedPrice.toLocaleString()}
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="mpesaphone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mpesa Payment Number</FormLabel>
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
                        </div>
                    )}
                    {loadingPrice && <p className="text-sm text-gray-500">Calculating price...</p>}

                    <div className='w-full pb-8'>
                        <Button type='submit' disabled={loading || isSubmitting} className='w-full cursor-pointer'>Book Now</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default FullLoadsForm