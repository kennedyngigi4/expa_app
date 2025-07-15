"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQS = () => {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">Why would I need a courier service?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Couriers fill the need for delivery of packages where shipping just doesn’t cut it. Some examples
                        would be when a delivery needs to be completed quickly or the same day. Others an include when a package
                        is too large to be shipped but still needs to be delivered quickly. Some deliveries are also too valuable to
                        leave to a normal shipping provider. A courier and same day delivery service fills those needs because your
                        package is picked up at point A and driven to point B without any stops in between. This means your package
                        arrives on time and safely to it’s destination.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">How are shipping cost calculated?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Costs for our courier and delivery services will vary based upon the size and weight of the item, what type of vehicle you require, how quickly you need the item delivered and the distance from your pick up point and delivery point. Contact us or use our online request form for an accurate quote.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">How quickly can you deliver my package?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Our  delivery services can vary in terms of delivery time. We offer a same day delivery service where we will pick up and deliver your package direct with no stops in between;Other courier services we offer include next day delivery, and a medical express which would deliver your package before end of the next business day. Contact us for more details regarding the types of services we provide.
                    </p>

                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">Do you have any packaging tips for using a courier service ?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Yes, we have an entire page on our website dedicated to Packaging Advice
                    </p>

                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">Do you offer medical courier services?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Yes,we deliver medical equipment, and medical supplies throughout Kenya. We are familiar with government regulations make sure to follow these regulations when performing any medical courier and delivery.
                    </p>

                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">How does your online delivery quote work?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Simply fill out your name, phone number, email, speed, pick up and delivery destination, and details of your delivery and we will get back to you with a quote within minutes.
                    </p>

                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">What hours are you open and when do you make deliveries?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        We understand that not every delivery is going to fall in between normal business hours so we are conveniently open from 9 am to 5 pm on weekdays, Saturdays from 9 am to 1 pm  and can make a delivery at any time of day or night. We are closed on Sundays and public holidays.
                    </p>

                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">Can we deliver and pick up parcels internationally?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Yes, we can! At ExPa we can now pick up and deliver parcels from most international destinations in North America and Europe. Just raise a Support Ticket on our Website with details of pickup and delivery destinations along with weight and dimensions of your package – someone would get back to you within 1 working day with a quote.
                    </p>

                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">How can I maximize the chances of a smooth delivery?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        You can do so by clearly mentioning the delivery address on each package that you send. Please inform the recipient of the expected Delivery Date.
                    </p>

                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10" className="border-b-2 border-white">
                <AccordionTrigger className="bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-2 font-medium">Will a package be delivered if nobody is there to accept it?</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Though a signature is required for any deliveries to be made, the package might be left with a neighbour  if you request so. You can also add notes to the Instructions field as to where you would like your package delivered if no one is at home. All Returns Package Authorizations will have to be authorized by us. You van request more info via our Contact Us Page.
                    </p>

                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default FAQS