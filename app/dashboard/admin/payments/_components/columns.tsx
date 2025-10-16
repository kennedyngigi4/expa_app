"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"


export type Payment = {
    id: string
    invoice_id: string
    amount: string
    transaction_code: string 
    customer_name: string
    phone_number: string
    date_created: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "date_created",
        header: "Date",
        cell: ({ row }) => {
            const formattedDate = new Date(row?.original?.date_created).toLocaleDateString("en-us", {
                year: "numeric", month: "short", day: "numeric"
            });


            return (
                <p>{formattedDate}</p>
            );
        }
    },
    {
        accessorKey: "invoice_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invoice
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "transaction_code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Transaction
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "customer_name",
        header: "Customer",
    }
    
]