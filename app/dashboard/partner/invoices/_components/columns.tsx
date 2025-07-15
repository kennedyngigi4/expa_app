"use client"

import { Button } from "@/components/ui/button"
import { InvoiceModel } from "@/lib/models/all_models"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"



export const columns: ColumnDef<InvoiceModel>[] = [
    {
        accessorKey: "invoice_id",
        header: "Invoice ID",
    },
    {
        accessorKey: "issued_at",
        header: "Date Issued",
        cell: ({row}) => {
            const formattedDate = new Date(row.getValue("issued_at")).toLocaleDateString("en-us", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })
            return (
                <p>{formattedDate}</p>
            );
        }
    },
    {
        accessorKey: "package_name",
        header: "Package",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({row}) => {
            const formattedAmount = Math.round(row.getValue("amount")).toLocaleString();

            return(
                <p>KSh {formattedAmount}</p>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            const status = row.getValue("status");

            return(
                <p className={cn("capitalize", status == "unpaid" ? "text-red-600" : "text-green-600")}>{status}</p>
            );
        }
    },
    {
        accessorKey: "",
        header: "Download PDF",
        cell: ({row}) => {
            return (
                <Button variant="ghost" className="cursor-pointer">Download PDF</Button>
            )
        }
    },
]