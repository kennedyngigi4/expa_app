"use client";

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import z, { optional } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trash2, UploadCloud, Weight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APIServices } from '@/lib/utils/api_services';
import { useSession } from 'next-auth/react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import LocationSearch from '@/components/ui/location-search';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


const itemSchema = z.object({
    name: z.string().min(1, "Name is required."),
    weight: z.string().optional(),
    description: z.string(),
})

const formSchema = z.object({
    name: z.string().min(4, { message: "Name must be at least 4 characters"}),
    package_type: z.string(),
    is_fragile: z.string(),
    urgency: z.string(),
    weight: z.string(),
    vehicle_type: z.string(),
    requires_pickup: z.string(),
    pickup_date: z.string(),
    recipient_name: z.string().min(1, "Recipient name is required."),
    recipient_phone: z.string().min(1, "Recipient phone is required."),
    recipient_address: z.string().min(1, "Recipient address is required."),
    recipient_latLng: z.string(),
    description: z.string().optional(),
    items: z.array(itemSchema).min(1, "At least one item is required")
})

const CorporatePackageOrder = () => {
    const {data:session} = useSession();
    const router = useRouter();
    const [ activeTab, setActiveTab] = useState("documents");
    const [ documents, setDocuments ] = useState<File[]>([]);
    const [ previewDocuments, setPreviewDocuments] = useState<string[]>([]);
    const [ calculatorData, setCalculatorData ] = useState<any>({});

    const [ selectedDelivery, setSelectedDelivery] = useState<string | null>("inter_county");
    const [ vehicleTypes, setVehicleTypes ] = useState<string[]>([]);
    const [ urgencyTypes, setUrgencyTypes ] = useState<string[]>([]);
    const [ packageTypes, setPackageTypes ] = useState<string[]>([]);

    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            package_type: "",
            is_fragile: "",
            urgency: "",
            weight: "",
            vehicle_type: "",
            requires_pickup: "",
            pickup_date: "",
            recipient_name: "",
            recipient_phone: "",
            recipient_address: "",
            recipient_latLng: "",
            description: "",
            items: [{name: "", weight: "", description: ""}]
        }
    });

    const { fields, append, remove} = useFieldArray({
        control: form.control,
        name: "items",
    });
    const { setValue } = form;

    useEffect(() => {
        const fetchData = async() => {
            if (!session?.accessToken) return;

            const [ urgencytypes, packagetypes, vehicle_types ] = await Promise.all([
                APIServices.get('deliveries/urgency_types/', session?.accessToken),
                APIServices.get('deliveries/package_types/', session?.accessToken),
                APIServices.get("fullloads/vehicle_types", session?.accessToken),
            ]);

            setUrgencyTypes(urgencytypes);
            setPackageTypes(packagetypes);
            setVehicleTypes(vehicle_types);
        }
        fetchData();
    }, [session]);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;

        const files = Array.from(e.target.files);

        // save files
        setDocuments(files);

        // generate preview urls
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewDocuments(previews);
    }


    const handleRemoveFile = async(index: number) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
        setPreviewDocuments((prev) => prev.filter((_, i) => i !== index));
    }


    const handleSelectedDelivery = async (value: any) => {
        setSelectedDelivery(value);
    }


    const handleNext = async(value: string) => {
        switch (value) {
            case "documents":
                setActiveTab(value);
                break;
            case "details":
                setActiveTab(value);
                break;
            case "items":
                const detailsValidation = await form.trigger([
                    "name", "package_type", "is_fragile", "urgency", "vehicle_type", "weight", "recipient_name", "recipient_phone", "recipient_address"
                ])

                if (detailsValidation) {
                    setActiveTab(value);
                }
                break;
            case "prices":
                setActiveTab(value);

                
                const weight = form.getValues("weight");
                const destination = form.getValues("recipient_address"); 
                const recipient_latLng = form.getValues("recipient_latLng");

                if (weight && recipient_latLng) {
                    await calculatePrice(weight, destination, recipient_latLng); // a helper function
                }
                break;
            default:
                break;
        }
    }

    const calculatePrice = async (weight: string, destination: string, recipient_latLng: string) => {
        console.log("Price calculator >>>>>>>>>");
        const formData = new FormData();
        formData.append("weight", weight);
        formData.append("recipient_latLng", recipient_latLng);

        if (!session?.accessToken) return;

        const resp = await APIServices.post("corporate/calculate_price/", session?.accessToken, formData);
        console.log(resp);
        setCalculatorData(resp);
    }

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        
        console.log(values.recipient_latLng);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("package_type", values.package_type);
        formData.append("is_fragile", values.is_fragile);
        formData.append("urgency", values.urgency);
        formData.append("weight", values.weight);
        formData.append("vehicle_type", values.vehicle_type);
        formData.append("requires_pickup", values.requires_pickup);
        formData.append("pickup_date", values.pickup_date);
        formData.append("recipient_name", values.recipient_name);
        formData.append("recipient_phone", values.recipient_phone);
        formData.append("recipient_address", values.recipient_address);
        formData.append("recipient_latLng", values.recipient_latLng);
        formData.append("description", values.description);
        formData.append("delivery_type", selectedDelivery);
        formData.append("package_items", JSON.stringify(values.items));
        formData.append("fees", calculatorData?.price);


        // documents attach
        documents.forEach((file, indx) => {
            formData.append("package_attachments", file);
        })
        

        if(!session?.accessToken) return;

        const res = await APIServices.post("corporate/create_order/", session?.accessToken, formData);
        if(res.success){
            toast.success(res.message);
            router.push("/packages");
        } else {
            toast.success(res.message);
        }
    }

    return (
        <section className="md:px-20 px-5 min-h-screen">
            <div className='flex flex-col pt-5'>
                <h1 className='text-primary font-semibold text-2xl'>Place Order</h1>
                <p className='text-slate-500'>Ensure you fill all required fields.</p>
            </div>


            <div className="py-8">
                <Tabs value={activeTab} className="w-full">
                    <TabsList className="w-full flex overflow-x-auto scrollbar-hide space-x-2">
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="items">Package Items</TabsTrigger>
                        <TabsTrigger value="prices">Price & Submit</TabsTrigger>
                    </TabsList>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <TabsContent value="documents">
                                <div className='py-5 flex flex-col'>
                                    <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
                                    <div className="w-40 h-40 border-4 border-slate-300 border-dashed bg-gray-100">
                                        <div className="flex flex-col justify-centre p-5 items-center" onClick={() => document.getElementById("fileInput")?.click()}>
                                        <UploadCloud className="w-6 h-6 text-slate-400" />
                                        <p className="text-center text-slate-400">Click to upload documents</p>
                                        <Input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            id="fileInput"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                        />
                                        </div>
                                    </div>
                                    {documents.map((file, index) => {
                                        const url = previewDocuments[index];

                                        if(file.type.startsWith("image/")){
                                            return (
                                                <div key={index} className='border p-2 relative'>
                                                    <img src={url} alt={file.name} className="w-full h-40 object-cover" />
                                                    <p className="text-sm mt-2 truncate">{file.name}</p>
                                                    <Button type="button" onClick={(e) => handleRemoveFile(index)} className='absolute top-0 right-0' variant="destructive" size="icon"><Trash2 /></Button>
                                                </div>
                                            )
                                        }

                                        if(file.type === "application/pdf"){
                                            return (
                                                <div key={index} className='border p-2 relative'>
                                                    <embed src={url} type="application/pdf" width="100%" height="150px" />
                                                    <p className="text-sm mt-2 truncate">{file.name}</p>
                                                    <Button type="button" onClick={(e) => handleRemoveFile(index)} className='absolute top-0 right-0' variant="destructive" size="icon"><Trash2 /></Button>
                                                </div>
                                            )
                                        }


                                        return (
                                            <div key={index} className='border p-2 relative'>
                                                <p className="text-sm mt-2 truncate">{file.name}</p>
                                                <Button type="button" onClick={(e) => handleRemoveFile(index)} className='absolute top-0 right-0' variant="destructive" size="icon"><Trash2 /></Button>
                                            </div>
                                        )
                                    })}
                                    </div>
                                </div>

                                <div className='pb-5'>
                                    <h1 className='font-semibold pb-1'>Choose Delivery Type</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {['inter_county'].map((item) => (
                                        <div className={cn('flex flex-col p-6 rounded-2xl border-2 border-slate-200 cursor-pointer', selectedDelivery==item.toString() ? "bg-orange-50 border-2 border-orange-400" : "" )} key={item} onClick={() => handleSelectedDelivery(item)}>
                                        <h1 className="capitalize font-semibold text-primary pb-5">{item.replace("_"," ")}</h1>
                                        <p className='text-slate-500 capitalize'>{item.replace("_", " ")}</p>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                <div className='py-5'>
                                    <Button type="button" className='bg-orange-400 cursor-pointer' onClick={() => handleNext("details")}>Next</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="details">
                                <div className='pb-3'>
                                    <h1 className='text-primary font-semibold text-xl'>Package Details</h1>
                                    <p className='text-slate-400'>Fill all required form fields</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 pt-4'>
                                    <div className='col-span-5'>
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
                                    <div className='col-span-3'>
                                        <FormField
                                            control={form.control}
                                            name="package_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Package Type</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Choose option" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {packageTypes.map((item: any) => (
                                                                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <FormField
                                            control={form.control}
                                            name="is_fragile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Is fragile?</FormLabel>
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
                                    <div className='col-span-2'>
                                        <FormField
                                            control={form.control}
                                            name="urgency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Urgency</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Choose option" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {urgencyTypes.map((item: any) => (
                                                                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
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
                                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 pt-4'>
                                    <FormField 
                                        name="vehicle_type"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Vehicle type</FormLabel>
                                                <FormControl>
                                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Choose vehicle type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {vehicleTypes.map((item: any) => (
                                                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        name="weight"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Weight</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="text"
                                                        className=""
                                                        placeholder="e.g. 10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                
                                    <FormField 
                                        name="requires_pickup"
                                        control={form.control}
                                        render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Schedule Pickup</FormLabel>
                                            <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
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
                                    <div>
                                        <FormField
                                            name="pickup_date"
                                            control={form.control}
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pickup Date</FormLabel>
                                                <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    className='bg-white'
                                                    {...field}
                                                />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 pt-4'>
                                    <FormField 
                                        name="recipient_name"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Recipient Name</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="text"
                                                        placeholder="e.g John Doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="recipient_phone"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Recipient Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="e.g +254722..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="recipient_address"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Recipient Address</FormLabel>
                                                <FormControl>
                                                    <LocationSearch value={field.value} onChange={field.onChange} onLatLngChange={(lat, lng) => { setValue("recipient_latLng", `${lat.toString()},${lng.toString()}`) }} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mt-4'>
                                    <FormField 
                                        name="description"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter description here" rows={5} {...field}></Textarea>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='flex space-x-15 mt-8'>
                                    <Button type="button" onClick={() => handleNext("documents")} variant="ghost" className='cursor-pointer'><ArrowLeft /> Back</Button>
                                    <Button type="button" onClick={() => handleNext("items")} className='cursor-pointer'>Next</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="items">
                                <div className='pb-3'>
                                    <h1 className='text-primary font-semibold text-xl'>Items Details</h1>
                                    <p className='text-slate-400'>Items included in the package.</p>
                                </div>
                                <div>
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="relative mb-5">
                                            <CardContent className="grid md:grid-cols-12 grid-cols-1 gap-4 p-4 justify-center items-center">
                                                <div className='md:col-span-3'>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Item Name</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder='Enter item name'
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className='md:col-span-2'>
                                                    {/* Weight */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.weight`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Weight <span className='text-xs'>(optional)</span></FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder='Enter item name'
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className='md:col-span-5'>
                                                    {/* Description */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.description`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Description</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder='Description here'
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className='md:col-span-2'>
                                                    <div className='flex flex-row gap-3 justify-center items-center'>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => remove(index >= 0)}
                                                            className="w-fit hover:cursor-pointer"
                                                        >
                                                            -
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() => append({ name: "", weight: "", description: "" })}
                                                            className='hover:cursor-pointer'
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                            </CardContent>
                                        </Card>
                                    ))}

                                    
                                </div>  
                                <div className='flex space-x-15 mt-8'>
                                    <Button type="button" onClick={() => handleNext("details")} variant="ghost" className='cursor-pointer'><ArrowLeft /> Back</Button>
                                    <Button type="button" onClick={() => handleNext("prices")} className='cursor-pointer'>Next</Button>
                                </div>  
                            </TabsContent>
                            <TabsContent value="prices">

                                <Card className="w-full max-w-lg mx-auto my-10">
                                    <CardHeader>
                                        <CardTitle>Payments</CardTitle>
                                        <CardDescription>
                                            Proceed with payments.
                                        </CardDescription>
                                        <CardAction>
                                            <Select value='mpesa'>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose payment option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                                                    <SelectItem value="airtel">Airtel Money</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                        {calculatorData?.price ? (
                                            <>
                                                <p>Route: <span className="text-slate-500 text-sm">{calculatorData?.origin_office} → {calculatorData?.destination_office}</span></p>
                                                <p>Price: <span className="text-slate-500 text-sm">KES {calculatorData?.price.toLocaleString()}</span></p>
                                            </>
                                        ) : <>
                                            <div className="text-red-500 flex flex-col justify-center items-center space-y-5">
                                                <div>{calculatorData.message}</div>
                                                <div className='text-sm'>Check your destination.</div>
                                            </div>
                                        </>}
                                        
                                    </CardContent>
                                    
                                        <CardFooter className='pt-10 flex flex-row justify-between'>
                                            <div className='flex space-x-15 mt-8'>
                                                <Button type="button" onClick={() => handleNext("items")} variant="ghost" className='cursor-pointer'><ArrowLeft /> Back</Button>
                                                {calculatorData?.price && (
                                                    <Button type="submit" className='cursor-pointer'>Submit</Button>
                                                )}
                                            </div> 
                                        </CardFooter>
                                    
                                </Card>

                                
                            </TabsContent>
                        </form>
                    </Form>
                </Tabs>
            </div>

        </section>
    );
}

export default CorporatePackageOrder