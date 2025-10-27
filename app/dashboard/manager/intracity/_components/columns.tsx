"use client"

import { Button } from "@/components/ui/button"
import { PackageModel } from "@/lib/models/all_models"
import { cn } from "@/lib/utils"
import { Checkbox } from "@radix-ui/react-checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"


export const columns: ColumnDef<PackageModel>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "package_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Order ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const packageItem = row?.original;
            return (
                <Link href={`/dashboard/manager/orders/${packageItem?.id}`}>{packageItem?.package_id}</Link>
            );
        }
    },
    {
        accessorKey: "delivery_type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Delivery Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const delivery_type = row.original.delivery_type;
            const size_category_name = row.original.size_category_name;
            const delivery = delivery_type.toString().replace("_", " ");

            return (
                <p className="capitalize">{delivery} - <span className="text-primary">{size_category_name}</span></p>
            );
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
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row?.original?.status;
            return (
                <p className={cn("capitalize", status === "pending" && "text-red-500", status === "assigned" && "text-orange-300", status === "in_transit" && "text-orange-400", status === "delivered" && "text-green-500")}>{status}</p>
            );
        }
    },
    {
        accessorKey: "sender_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sender
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const sender_name = row?.original?.sender_name;
            const created_by_role = row?.original.created_by_role;

            return (
                <p>{sender_name} - <span className="text-xs capitalize">{created_by_role}</span></p>
            );
        }
    },
    {
        accessorKey: "is_paid",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Payments
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const isPaid = row?.original?.is_paid;

            return (
                <p className={cn("text-red-500", isPaid && "text-green-500")}>{isPaid ? "Paid" : "Unpaid"}</p>
            )
        }
    },
    {
        accessorKey: "recipient_address",
        header: "Destination",
    },
]