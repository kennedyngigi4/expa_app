"use client"

import { Button } from "@/components/ui/button"
import { ShipmentModel } from "@/lib/models/all_models"
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
    },
    // {
    //     accessorKey: "originoffice",
    //     header: "Origin Office",
    // },
    {
        accessorKey: "packages.length",
        header: "Packages",
    },
    {
        accessorKey: "",
        header: "Action",
        cell: ({ row }) => {
            const shipment = row.original
            return (
                <Link href={`/dashboard/manager/shipments/${shipment.id}/`}><MoreHorizontal /></Link>
            );
        }
    },
]