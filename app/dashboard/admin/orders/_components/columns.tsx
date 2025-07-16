"use client"

import { Button } from "@/components/ui/button"
import { PackageModel } from "@/lib/models/all_models"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"


export const columns: ColumnDef<PackageModel>[] = [
    {
        accessorKey: "package_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Package ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
          },
    },
    {
        accessorKey: "delivery_type",
        header: "Delivery Type",
        cell: ({row}) => {
            const deliveryType = row.getValue("delivery_type");

            return (
                <p className="capitalize">{deliveryType.replace("_"," ")}</p>
            );
        }
    },
    {
        accessorKey: "package_type_name",
        header: "Package Type",
    },
    {
        accessorKey: "sender_name",
        header: "Sender",
    },
    {
        accessorKey: "recipient_name",
        header: "Recipient",
    },
    {
        accessorKey: "status",
        header: "Status",
    }
]