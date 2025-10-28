"use client"

import { Button } from "@/components/ui/button"
import { ShipmentModel } from "@/lib/models/all_models"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<ShipmentModel>[] = [
    {
        accessorKey: "shipment_id",
        header: "Shipment ID",
    },
    {
        accessorKey: "shipment_type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Shipment Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const shipmentType = row.getValue("shipment_type");

            return(
                <p className="capitalize">{shipmentType}</p>
            );
        }
    },
    {
        accessorKey: "originoffice",
        header: "From",
    },
    {
        accessorKey: "destinationoffice",
        header: "Destination",
        cell: ({row}) => {
            const destination = row?.original?.destinationoffice != null ? row?.original?.destinationoffice : row?.original?.destination_location
            
            return (
                <p>{destination}</p>
            );
        }
    },
    {
        accessorKey: "packages.length",
        header: "Packages",
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row?.original?.status;
            const statusColor = {
                assigned: "text-orange-300",
                pending: "text-red-500",
                in_transit: "text-orange-400",
                delivered: "text-green-500",
            }[status] || "text-gray-500";

            return <p className={cn("capitalize", statusColor)}>{status}</p>;
        }
    },
]