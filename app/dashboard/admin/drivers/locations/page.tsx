"use client"

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Loader from '@/components/modals/loader';
import { useSession } from 'next-auth/react';
import { UserModel } from '@/lib/models/user_model';
import { APIServices } from '@/lib/utils/api_services';

const containerStyle = {
    width: "100%",
    height: "500px",
};


const center = {
    lat: -1.286389, // Nairobi default
    lng: 36.817223,
  };

const LiveLocation = ({ riderLocations }) => {
    const { data:session } = useSession();
    const [drivers, setDrivers] = useState<UserModel[]>([]);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });


    const fetchData = async () => {
        if (!session?.accessToken) return;

        const roles = ['driver', 'partner_rider']
        const query = roles.map(r => `role=${r}`).join('&');

        const data = await APIServices.get(`account/superadmin/users/?${query}`, session?.accessToken);

        setDrivers(data || []);
    };

    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [session]);

    if (!isLoaded) return <Loader />;

    const icons = {
        partner_rider: "/icons/bike.png",
        driver: "/icons/truck.png"
    }

    return (
        <section className="w-full h-full">
            <GoogleMap 
                mapContainerStyle={containerStyle} 
                center={center} 
                zoom={13}
                options={{ streetViewControl: false, mapTypeControl: false}}    
            >
                {drivers.map((driver, index) => {
                    const location = driver.location;
                    if(!location?.latitude || !location?.longitude) return null;

                    const iconUrl = driver.role === "partner_rider" ? icons.partner_rider : icons.driver;

                    return(
                        
                        <Marker
                            key={index}
                            position={{
                                lat: parseFloat(driver.location.latitude),
                                lng: parseFloat(driver.location.longitude),
                            }}
                            label={{
                                text: driver.full_name || "",
                                className: "text-black text-xs bg-white px-0 rounded",
                            }}
                            icon={{
                                url: iconUrl,
                                scaledSize: new window.google.maps.Size(65, 65),
                            }}
                        />
                        
                    );
                })}
            </GoogleMap>
        </section>
    );
}

export default LiveLocation