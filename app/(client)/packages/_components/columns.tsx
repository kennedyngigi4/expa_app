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
        accessorKey: "",
        header: "Payments",
        cell: ({row}) => {
            const packageid = row.getValue("package_id");

            return (
                <ConfirmPaymentsModal title="Confirm Payments" subtitle={packageid}>
                    <div className="flex flex-col space-y-3.5">
                        <div>
                            <Label className="pb-1">MPESA Code</Label>
                            <Input type="text" className="bg-white" placeholder="e.g. TFM1V9VNHF" />
                        </div>
                        <div className="w-full">
                            <Button className="w-full">Confirm</Button>
                        </div>
                    </div>
                </ConfirmPaymentsModal>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
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