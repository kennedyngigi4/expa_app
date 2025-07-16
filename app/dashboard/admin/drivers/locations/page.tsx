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


    useEffect(() => {
        const fetchData = async() => {
            if(!session?.accessToken){
                throw new Error("You must be logged in.");
            }

            const roles = ['driver', 'partner_rider']
            const query = roles.map(r => `role=${r}`).join('&');

            const data = await APIServices.get(`account/superadmin/users/?${query}`, session?.accessToken);
            
            setDrivers(data);
        }
        fetchData();
    }, [session]);

    if (!isLoaded) return <Loader />;

    return (
        <section>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>

            </GoogleMap>
        </section>
    );
}

export default LiveLocation