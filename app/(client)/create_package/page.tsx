"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, UploadCloud } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { APIServices } from '@/lib/utils/api_services';
import { toast } from 'sonner';
import { SizeCategoryModel } from '@/lib/models/size_category_model';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { PackageTypeModel, UrgencyModel } from '@/lib/models/all_models';
import LocationSearch from '@/components/ui/location-search';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from 'next/image';


const formSchema = z.object({
  name: z.string().min(1, { message: "Package Name is required." }),
  package_type: z.string().min(1, { message: "Package Type is required." }),
  is_fragile: z.string().min(1, {message: "Is package fragile?"}),
  urgency: z.string().min(1, { message: "Urgency level is required." }),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  pickup_date: z.string().min(1, { message: "Pickup Date is required." }),
  sender_address: z.string().min(1, { message: "Pickup location is required." }),
  sender_latLng: z.string().optional(),
  description: z.string().optional(),
  recipient_name: z.string().min(1, { message: "Recipient name is required." }),
  recipient_phone: z.string().min(1, { message: "Recipient phone is required." }),
  recipient_address: z.string().min(1, { message: "Recipient address is required." }),
  recipient_latLng: z.string().optional(),
  requires_last_mile: z.string().min(1, { message: "Required"}),
  requires_pickup: z.string().min(1, { message: "Required" }),
  mpesaphone: z.string().min(1, { message: "Mpesa number is required." }),
})


const CreatePackagePage = () => {
  const { data:session} = useSession();
  const router = useRouter();
  const [ activeTab, setActiveTab ] = useState("images");
  const [ previewUrls, setPreviewUrls ] = useState<string[]>([]);
  const [ images, setImages ] = useState<File[]>([]);
  const [ sizeCategories, setSizeCategories ] = useState<SizeCategoryModel[]>([]);
  const [ urgencyTypes, setUrgencyTypes ] = useState<UrgencyModel[]>([]);
  const [ packageTypes, setPackageTypes] = useState<PackageTypeModel[]>([]);
  const [ selectedSize, setSelectedSize ] = useState("");
  const [ selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [ distancekm, setDistancekm ] = useState(0);
  const [ estimatedPrice, setEstimatedPrice ] = useState(0);
  const [ pickupPrice, setPickupPrice] = useState(0);
  const [ lastMileFee, setLastMileFee ] = useState(0);
  const [ totalFee, setTotalFee] = useState(0);
  const [pricingError, setPricingError] = useState("");
  

  useEffect(() => {
    // get selected deliverytype from homepage
    const storedDeliveryType = sessionStorage.getItem("deliveryType");
   
    setSelectedDelivery(storedDeliveryType);
  }, []);


  useEffect(() => {
    const fetchData = async() => {
      try {
        if(!session?.accessToken){
          throw new Error("You must be logged in!");
        }

        const [sizesData, urgenciesData, packagesData ] = await Promise.all([
          APIServices.get('deliveries/size_category/', session?.accessToken),
          APIServices.get('deliveries/urgency_types/', session?.accessToken),
          APIServices.get('deliveries/package_types/', session?.accessToken),
        ]);
        
        setSizeCategories(sizesData);
        setUrgencyTypes(urgenciesData);
        setPackageTypes(packagesData);
      } catch(e){
        toast.error("An error occured, "+e);
      }
    }
    fetchData();
  }, [session]);


  const handleImagesUpload = async (files: FileList | null) => {
    if(!files) return;
    const selectedFiles = Array.from(files);

    const uniqueFiles = selectedFiles.filter((file) => !images.some((img) => img.name === file.name));
    setImages((prev) => [...prev, ...uniqueFiles]);

    // previewImages
    const previewImages = uniqueFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previewImages]);
  }


  const handleRemoveImage = async(index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  }

  const handleSelectedSize = async(value: any) => {
    setSelectedSize(value);
  }

  const handleSelectedDelivery = async(value: any) => {
    setSelectedDelivery(value);
  }


  const handleNext = async(value: string) => {
    switch(value){

      case "images":
        setActiveTab(value);
        break;
      case "details":
        if (selectedDelivery == ""){
          toast.error("Delivery Type is required.");
          return;
        } else if (selectedSize == ""){
          toast.error("Package Size Type is required.");
          return;
        }
        setActiveTab(value);
        break;
      case "recipient":
        const detailsValid = await form.trigger([
          "name", "package_type", "urgency", "is_fragile", "sender_address", "requires_pickup","pickup_date"
        ]);

        if (detailsValid){
          setActiveTab(value);
        }
        break;

      case "preview":
        const isValid = await form.trigger([
          "recipient_name",
          "recipient_phone",
          "recipient_address",
          "recipient_latLng",
          "sender_latLng",
          "weight",
          "length",
          "width",
          "height",
        ]);

        if (isValid) {
          const formData = form.getValues();

          console.log(selectedDelivery);

          if (selectedDelivery == "intra_city"){
            if(selectedSize == "1"){
              intracityPriceCalculator({
                sender_latLng: formData.sender_latLng,
                recipient_latLng: formData.recipient_latLng,
                size_category: selectedSize,
                weight: formData.weight,
                length: 0,
                width: 0,
                height: 0,
              });
            } else {
              intracityPriceCalculator({
                sender_latLng: formData.sender_latLng,
                recipient_latLng: formData.recipient_latLng,
                size_category: selectedSize,
                weight: formData.weight,
                length: formData.length,
                width: formData.width,
                height: formData.height,
              });
            }
          } else if (selectedDelivery == "inter_county") {
            if (selectedSize == "1") {
              intercountyPriceCalculator({
                sender_latLng: formData.sender_latLng,
                recipient_latLng: formData.recipient_latLng,
                size_category: selectedSize,
                weight: formData.weight,
                length: "1",
                width: "1",
                height: "1",
                requires_last_mile: formData.requires_last_mile,
                requires_pickup: formData.requires_pickup,
              });
            } else if (selectedSize == "2") {
              intercountyPriceCalculator({
                sender_latLng: formData.sender_latLng,
                recipient_latLng: formData.recipient_latLng,
                size_category: selectedSize,
                weight: formData.weight,
                length: formData.length,
                width: formData.width,
                height: formData.height,
                requires_last_mile: formData.requires_last_mile,
                requires_pickup: formData.requires_pickup,
              });
            }
          }
          
          setActiveTab(value);
        }
        break;
      default:
        setActiveTab(value);
        break;
    }
   
  }


  const handlePrevious = async (value: string) => {
    switch (value) {
      case "details":
        setActiveTab(value);
      case "recipient":
        setActiveTab(value);
      default:
        setActiveTab(value);
    }
  }


  const form = useForm<z.infer <typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      package_type: "",
      is_fragile: "",
      urgency: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      pickup_date: "",
      sender_address: "",
      sender_latLng: "",
      description: "",
      recipient_name: "",
      recipient_phone: "",
      recipient_address: "",
      recipient_latLng: "",
      requires_last_mile: "",
      requires_pickup: "",
      mpesaphone: "",
    },
  });

  const { setValue } = form;
  const formValues = form.watch();

  const onSubmit = async(values: z.infer<typeof formSchema>) => {

    if(!session?.accessToken){
      throw new Error("You must be logged in.");
    }
    
    try{
      const formData = new FormData();
      formData.append("size_category", selectedSize);
      formData.append("name", values.name);
      formData.append("package_type", values.package_type);
      formData.append("is_fragile", values.is_fragile);
      formData.append("urgency", values.urgency);
      formData.append("pickup_date", values.pickup_date);
      formData.append("sender_name", session?.user.name);
      formData.append("sender_phone", session?.user.phone);
      formData.append("sender_address", values.sender_address);
      
      formData.append("recipient_name", values.recipient_name);
      formData.append("recipient_phone", values.recipient_phone);
      formData.append("recipient_address", values.recipient_address);
      
      formData.append("requires_pickup", values.requires_pickup);
      formData.append("requires_last_mile", values.requires_last_mile);
      

      if(estimatedPrice){
        formData.append("fees", estimatedPrice);
      }

      if (values.sender_latLng){
        formData.append("sender_latLng", values.sender_latLng);
      }

      if (values.recipient_latLng) {
        formData.append("recipient_latLng", values.recipient_latLng);
      }

      if(selectedDelivery){
        formData.append("delivery_type", selectedDelivery);
      }

      if (values.length) {
        formData.append("length", values.length);
      }

      if (values.width) {
        formData.append("width", values.width);
      }

      if (values.height) {
        formData.append("height", values.height);
      }

      if (values.weight) {
        formData.append("weight", values.weight);
      }

      if (values.description) {
        formData.append("description", values.description);
      }
      
      const res = await APIServices.post("deliveries/add_order/", session?.accessToken, formData);
      
      if(res.success){
        toast.success("Upload successful!");
        router.push("/packages");
      } else {
        toast.error("An error occurred.");
        window.location.reload;
      }

    } catch(e){
      toast.error("An error occurred.");
    }
  }


  const intracityPriceCalculator = async (payload: {
    sender_latLng: any;
    recipient_latLng: any;
    size_category: string;
    weight: any;
    length: any;
    width: any;
    height: any;
  }) => {
      setPricingError("");
      if (!session?.accessToken) {
        throw new Error("You must be logged in.");
      }

      const res = await APIServices.intracity("deliveries/intracity_pricing/", session?.accessToken, payload);
      console.log(res.estimated_fee);
      if(res.success){
        setEstimatedPrice(res.estimated_fee);
        setDistancekm(res.distance_km);
      } else {
        setPricingError(res.message)
      }
  }


  const intercountyPriceCalculator = async(payload: {
    sender_latLng: any;
    recipient_latLng: any;
    size_category: string;
    weight: any;
    length: any;
    width: any;
    height: any;
    requires_last_mile: any;
    requires_pickup: any;
  }) => {

    setPricingError("");
    if (!session?.accessToken) {
      throw new Error("You must be logged in.");
    }

    const res = await APIServices.intracity("deliveries/intercounty_pricing/", session?.accessToken, payload);
    console.log(res);
    if (res.success) {
      setPickupPrice(res.pickup_fee);
      setEstimatedPrice(res.base_fee);
      setLastMileFee(res.last_mile_fee);
      setTotalFee(res.estimated_fee);

    } else {
      setPricingError(res.message)
    }
  }

  return (
    <section className="min-h-screen">

      <div className="bg-orange-100 flex md:flex-row flex-col justify-between items-center px-12 md:px-30 md:h-[300px] overflow-hidden">
        <div className="flex-1">
          <div className="py-10">
            <h1 className="font-bold text-2xl">Place Order</h1>
            <p className='text-slate-800'>Ensure you fill all required fields.</p>
          </div>
        </div>

        
        <div className="relative flex-1 h-full overflow-hidden max-md:hidden">
          <Image
            src="/icons/avatar.png"
            alt="EXPA"
            fill
            className="object-contain md:object-right"
            priority
          />
        </div>
      </div>

      
      <div className='py-8 md:px-20 px-5'>
        <Tabs value={activeTab} className="w-full">
          <TabsList className="w-full flex overflow-x-auto scrollbar-hide space-x-2">
            <TabsTrigger value="images">Image & Type</TabsTrigger>
            <TabsTrigger value="details">Package Details</TabsTrigger>
            <TabsTrigger value="recipient">Recipient</TabsTrigger>
            <TabsTrigger value="preview">Payments</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <TabsContent value="images">
                <div className='py-5 flex flex-col'>
                  <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
                    <div className="w-40 h-40 border-4 border-slate-300 border-dashed bg-gray-100">
                      <div className="flex flex-col justify-centre p-5 items-center" onClick={() => document.getElementById("fileInput")?.click()}>
                        <UploadCloud className="w-6 h-6 text-slate-400" />
                        <p className="text-center text-slate-400">Click to upload images</p>
                        <Input
                          type="file"
                          multiple
                          className="hidden"
                          id="fileInput"
                          onChange={(e) => handleImagesUpload(e.target.files)}
                        />
                      </div>
                    </div>
                    {previewUrls.map((src, index) => (
                      <div key={index} className="ml-3 mb-3 relative">
                        <img src={src} alt="Preview" className="md:w-50 md:h-40 w-60 h-60 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='pb-5'>
                  <h1 className='font-semibold pb-1'>Choose Delivery Type</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['intra_city', 'inter_county', 'international'].map((item) => (
                      <div className={cn('flex flex-col p-6 rounded-2xl border-2 border-slate-200 cursor-pointer', selectedDelivery==item.toString() ? "bg-orange-50 border-2 border-orange-400" : "" )} key={item} onClick={() => handleSelectedDelivery(item)}>
                        <h1 className="capitalize font-semibold text-primary pb-5">{item.replace("_"," ")}</h1>
                        <p className='text-slate-500 capitalize'>{item.replace("_", " ")}</p>
                      </div>
                    ))}
                  </div>
                </div>


                <div className='pb-5'>
                  <h1 className='font-semibold pb-1'>Choose Package Type</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {sizeCategories.map((item) => (
                      <div className={cn('flex flex-col p-6 rounded-2xl border-2 border-slate-200 cursor-pointer', selectedSize == item.id.toString() ? "bg-orange-50 border-2 border-orange-400" : "")} key={item.id} onClick={() => handleSelectedSize(item.id)}>
                        <h1 className="capitalize font-semibold text-primary pb-5">{item.name}</h1>
                        <p className='text-slate-500'>{item.description}</p>
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
                                  {packageTypes.map((item) => (
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
                                  {urgencyTypes.map((item) => (
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

                
                  <div className='grid grid-cols-2 md:grid-cols-12 gap-5 pt-5'>
                    {selectedSize.toString() !== "1" && (
                      <>
                      <div className='col-span-3'>
                        <FormField 
                          name="length"
                          control={form.control}
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Length (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 28"
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
                          name="width"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Width (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 19"
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
                          name="height"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 15"
                                  className="bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      </>
                    )}


                      <div className='col-span-3'>
                        <FormField
                          name="weight"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kgs)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 10"
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
               

                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 pt-5'>
                  <div>
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
                  </div>
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
                  <div>
                    <FormField
                      name="sender_address"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Location</FormLabel>
                          <FormControl>
                            <LocationSearch value={field.value} onChange={field.onChange} onLatLngChange={(lat, lng) => { setValue("sender_latLng", `${lat.toString()},${lng.toString()}`) }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* <div>
                    <FormField
                      name="sender_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder='e.g. John Doe'
                              className='bg-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}
                  {/* <div>
                    <FormField
                      name="sender_phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder='254722.....'
                              className='bg-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}
                </div>
                
                <div className="pt-5">
                  <FormField 
                    name="description"
                    control={form.control}
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Enter description here ...' {...field}></Textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='py-5 flex space-x-15'>
                  <Button variant="ghost" type="button" className='cursor-pointer' onClick={() => handlePrevious("images")}><ArrowLeft /> Back</Button>
                  <Button type="button" className='bg-orange-400 cursor-pointer' onClick={() => handleNext("recipient")}>Next</Button>
                </div>
              </TabsContent>
              <TabsContent value="recipient">
                <div className='py-3'>
                  <h1 className='text-primary font-semibold text-xl'>Recipient Details</h1>
                  <p className='text-slate-400'>Fill all required form fields</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 pt-5'>
                  <div>
                    <FormField
                      name="recipient_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder='e.g. John Doe'
                              className='bg-white'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      name="recipient_phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder='e.g. 254722....'
                              className='bg-white'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
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
                </div>


                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 pt-5'>
                  <div>
                    <FormField
                      name="requires_last_mile"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Method</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Choose the delivery method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Door Delivery</SelectItem>
                                <SelectItem value="false">Pickup from Office</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='py-5 flex space-x-15'>
                  <Button variant="ghost" type="button" className='cursor-pointer' onClick={() => handlePrevious("details")}><ArrowLeft /> Back</Button>
                  <Button type="button" className='bg-orange-400 cursor-pointer' onClick={() => handleNext("preview")}>Next</Button>
                </div>
              </TabsContent>
              <TabsContent value="preview">


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
                    {selectedDelivery == "intra_city" && (
                      <div className='space-y-5'>
                        <h1 className="flex flex-row justify-between items-center">Estimated Fee <span>{estimatedPrice}</span></h1>
                        <h1 className="flex flex-row justify-between items-center">Distance in Kms <span>{distancekm}kms</span></h1>
                      </div>
                    )}

                    {selectedDelivery == "inter_county" && (
                      <div className='space-y-5'>
                        {pickupPrice != 0 && (
                          <h1 className="flex flex-row justify-between items-center">Pick up Fee <span>KSh. {pickupPrice.toLocaleString()}</span></h1>
                        )}
                        <h1 className="flex flex-row justify-between items-center">Estimated Fee <span>KSh. {estimatedPrice.toLocaleString()}</span></h1>
                        {lastMileFee != 0 && (
                          <h1 className="flex flex-row justify-between items-center">Last Mile Fee <span>KSh. {lastMileFee.toLocaleString()}</span></h1>
                        )}
                        <h1 className="flex flex-row justify-between items-center py-6">Total Fee <span>KSh. {totalFee.toLocaleString()}</span></h1>
                      </div>
                    )}

                    <div className='pt-8 mx-auto text-center'>
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
                  </CardContent>
                  <CardFooter className='pt-10 flex flex-row justify-between'>
                    
                      <Button variant="ghost" type="button" className='cursor-pointer' onClick={() => handlePrevious("recipient")}><ArrowLeft /> Back</Button>
                      
                      {(estimatedPrice != 0 || totalFee != 0) ? (
                        <Button type="submit" className='bg-orange-400 cursor-pointer'>Submit</Button>
                      ) : (
                        <p className='text-red-500'>{pricingError}</p>
                      )}
                      
                    
                  </CardFooter>
                </Card>



                

                


                
                

                
              </TabsContent>
            </form>
          </Form>
          
          
        </Tabs>
      </div>
    </section>
  )
}

export default CreatePackagePage