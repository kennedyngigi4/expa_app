"use client"

import { Button } from "@/components/ui/button";
import { PackageModel } from "@/lib/models/all_models";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import ConfirmPaymentsModal from "@/components/modals/confirm_payments";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
        accessorKey: "recipient_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Recipient
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "recipient_address",
        header: "Destination",
    },
    {
        accessorKey: "is_paid",
        header: "Payments",
        cell: ({row}) => {
            const isPaid = row?.original?.is_paid;

            return (
                <p className={cn("text-red-500", isPaid && "text-green-500")}>{isPaid ? "Paid" : "Unpaid"}</p>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row?.original?.status;
            return (
                <p className={cn("capitalize", status === "pending" || status === "created" && "text-red-500", status === "assigned" && "text-orange-300", status === "in_transit" && "text-orange-400", status === "delivered" && "text-green-500")}>{status}</p>
            );
        }
    },
    {
        accessorKey: "",
        header: "Action",
        cell: ({row}) => {
            const slug = row.original.slug;

            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        
                        <DropdownMenuSeparator />
                        <Link href={`/packages/${slug}`}>
                            <DropdownMenuItem>View package details</DropdownMenuItem>
                        </Link>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    },
]