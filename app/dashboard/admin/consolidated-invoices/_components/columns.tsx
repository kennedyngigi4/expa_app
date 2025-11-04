"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { useSession } from "next-auth/react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Consolidated = {
    id: string
    total_amount: number
    status: string
    consolidated_invoice_id: string
    invoices: any
    client_name: string
}

export const columns: ColumnDef<Consolidated>[] = [
    {
        accessorKey: "consolidated_invoice_id",
        header: "ID",
    },
    {
        accessorKey: "client_name",
        header: "Client",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            const status = row.getValue("status");

            return(
                <p className={cn("text-orange-600 capitalize", status === "paid" && "text-green-600" )}>{status}</p>
            )
        }
    },
    {
        accessorKey: "total_amount",
        header: "Amount (Kes)",
        cell: ({row}) => {
            const amount = row?.original?.total_amount;

            return (
                <p>{parseInt(amount).toLocaleString()}</p>
            );
        }
    },
    {
        accessorKey: "invoices",
        header: "Invoices",
        cell: ({ row }) => {
            const invoices = row?.original?.invoices;

            return (
                <p>{invoices.length}</p>
            )
        }
    },
    {
        accessorKey: "",
        header: "Download PDF",
        cell: ({ row }) => {
            const { data: session } = useSession();
            const invoice = row?.original;
            const downloadPdf = async (id: string) => {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/payments/superadmin/consolidated-pdf/${id}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${session?.accessToken}`
                    }
                });

                console.log(resp);

                if (!resp.ok) {
                    alert("Failed to fetch invoice");
                    return;
                }

                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blank"); // opens in new tab
                console.log(resp);
            }
            return (
                <Button onClick={() => downloadPdf(invoice?.id)} variant="ghost" className="cursor-pointer">Download PDF</Button>
            )
        }
    },
    
]