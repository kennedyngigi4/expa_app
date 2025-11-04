"use client"

import { Button } from "@/components/ui/button"
import { ShipmentModel } from "@/lib/models/all_models"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<ShipmentModel>[] = [
    {
        accessorKey: "shipment_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Shipment ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
          },
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
            const shipmentType = row?.original?.shipment_type;

            return (
                <p>
                    {shipmentType === "delivery" && "Last mile"}
                    {shipmentType === "pickup" && "First mile"}
                    {shipmentType === "transfer" && "Line haul"}
                </p>
            )
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Delivery Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const status = row?.original?.status;
            return(
                <p className={cn("capitalize", status === "pending" || status === "created" && "text-red-500", status === "assigned" && "text-orange-300", status === "in_transit" && "text-orange-400", status === "delivered" && "text-green-500")}>{status}</p>
            );
        }
    },
    {
        accessorKey: "summary",
        header: "Summary",
    },
    {
        accessorKey: "packages.length",
        header: "Packages",
    },
    {
        accessorKey: "",
        header: "Action",
        cell: ({row}) => {
            const shipment = row.original
            return(
                <Link href={`/dashboard/manager/shipments/${shipment.id}/`}><MoreHorizontal /></Link>
            );
        }
    },
]