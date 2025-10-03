"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    price: number
    pickup_address: string
    dropoff_address: string
    created_at: string
    distance: string
    weight: string
    vehicle: string
    booking_id: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "booking_id",
        header: "ID",
    },
    {
        accessorKey: "vehicle",
        header: "Vehicle",
    },
    {
        accessorKey: "",
        header: "Route",
        cell: ({row}) => {
            const load = row?.original;

            return(
                <div className="flex flex-col">
                    <p>From: {load.pickup_address}</p>
                    <p>To: {load.dropoff_address}</p>
                </div>
            );
        }
    },
    {
        accessorKey: "weight",
        header: "Weight (tons)",
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({row}) => {
            const formattedDate = new Date(row.original.created_at).toLocaleDateString("en-us", {
                year: "numeric", month: "short", day: "numeric"
            })
            return(
                <p>{formattedDate}</p>
            );
        }
    },
]