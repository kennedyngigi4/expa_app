"use client"

import { Button } from "@/components/ui/button"
import { PackageModel } from "@/lib/models/all_models"
import { cn } from "@/lib/utils"
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
        cell: ({ row }) => {
            const deliveryType = row.getValue("delivery_type");

            return (
                <p className="capitalize">{deliveryType.replace("_", " ")}</p>
            );
        }
    },
    {
        accessorKey: "name",
        header: "Package",
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
    }
]