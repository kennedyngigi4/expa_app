"use client"

import { Button } from "@/components/ui/button"
import { InvoiceModel } from "@/lib/models/all_models"
import { cn } from "@/lib/utils"
import { APIServices } from "@/lib/utils/api_services"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Checkbox } from "@/components/ui/checkbox"



export const InvoiceColumns: ColumnDef<InvoiceModel>[] = [
    
    {
        id: "select",
        header: ({table}) => {
            const allRows = table.getRowModel().rows;
            const selectableRows = allRows.filter((row) => {
                const status = row.original.status;
                const isSelectable = (status === "pending" || status === "unpaid");
                return isSelectable;
            });

            const allSelectableSelected =
                selectableRows.length > 0 &&
                selectableRows.every((row) => row.getIsSelected());

            const someSelectableSelected = selectableRows.some((row) =>
                row.getIsSelected()
            );

            return (
                <Checkbox
                    checked={
                        allSelectableSelected
                            ? true
                            : someSelectableSelected
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={(value) => {
                        selectableRows.forEach((row) => row.toggleSelected(!!value));
                    }}
                    aria-label="Select all selectable rows"
                    disabled={selectableRows.length === 0}
                />
            );
        },
        cell: ({row}) => {
            const status = row.original.status;
            const isSelectable = (status === "pending" || status === "unpaid");

            return (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    disabled={!isSelectable}
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "invoice_id",
        header: "Invoice ID",
    },
    {
        accessorKey: "issued_at",
        header: "Date Issued",
        cell: ({ row }) => {
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
        cell: ({ row }) => {
            const formattedAmount = Math.round(row.getValue("amount")).toLocaleString();

            return (
                <p>KSh {formattedAmount}</p>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");

            return (
                <p className={cn("capitalize", status == "unpaid" ? "text-red-600" : "text-green-600")}>{status}</p>
            );
        }
    },
    {
        accessorKey: "",
        header: "Download PDF",
        cell: ({ row }) => {
            const { data: session } = useSession();
            const invoice = row?.original;
            const downloadPdf = async (id: string) => {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/payments/invoices/${id}/`, {
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
    {
        id: "month",
        accessorFn: (row) => {
            const date = new Date(row.issued_at)
            return (date.getMonth() + 1).toString() // "1".."12"
        },
        header: "",

    },
]