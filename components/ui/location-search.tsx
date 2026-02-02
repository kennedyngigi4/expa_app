"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader } from "@googlemaps/js-api-loader";
import { toast } from 'sonner';


const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"]
})


interface LocationSearchProps {
    value: string;
    onChange: (value: string) => void;
    onLatLngChange: (lat: number, lng: number) => void;
}


const LocationSearch = ({ value, onChange, onLatLngChange }: LocationSearchProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let autocomplete: google.maps.places.Autocomplete;
        loader.load().then(() => {
            if (inputRef.current) {
                autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                    // types: ["geocode"],
                    componentRestrictions: { country: ["ke"] },
                });

                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();

                    if (
                        place.formatted_address === "Garissa County, Kenya" &&
                        place.types?.includes("administrative_area_level_2")
                    ) {
                        toast.error(
                            "That location has incorrect coordinates. Please select Garissa town or a specific area."
                        );
                        
                        onChange("");
                        return;
                    }

                    const address = inputRef.current?.value || "";

                    let countyOrRegion = "";
                    let country = "";

                    if (place.address_components) {
                        for (const component of place.address_components) {
                            const types = component.types;

                            console.log(types);

                            if (types.includes("administrative_area_level_2")) {
                                countyOrRegion = component.long_name;
                            }

                            if (!countyOrRegion && types.includes("administrative_area_level_1")) {
                                countyOrRegion = component.long_name;
                            }

                            if (types.includes("country")) {
                                country = component.long_name;
                            }
                        }
                        console.log(countyOrRegion)
                    }

                    const finalAddress = `${address} ${countyOrRegion ? `, ${countyOrRegion}` : ""}${country ? `, ${country}` : ""}`;
                    console.log(finalAddress);
                    onChange(finalAddress);


                    if (place.geometry && place.geometry.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        onLatLngChange(lat, lng);
                    }


                });



            }
        });

    }, [onChange, onLatLngChange]);

    return (
        <div>
            <Input
                ref={inputRef}
                placeholder="Search location"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default LocationSearch