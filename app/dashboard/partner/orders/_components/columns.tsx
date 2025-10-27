"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PackageModel } from "@/lib/models/all_models"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"

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
    },
    {
        accessorKey: "",
        header: "Action",
        cell: ({ row }) => {
            const slug = row.original.slug;

            return (
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