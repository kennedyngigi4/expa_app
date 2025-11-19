"use client";

import React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { APIServices } from "@/lib/utils/api_services";
import { useRouter } from "next/navigation";

interface InvoiceDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function InvoiceDataTable<TData, TValue>({
    columns,
    data,
}: InvoiceDataTableProps<TData, TValue>) {
    const {data:session} = useSession();
    const router = useRouter();
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
            columnVisibility: {
                month: false,
            },
        },
    });

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedInvoicesIds = table.getFilteredSelectedRowModel().rows.map((row) => row?.original?.id);

    const handleInvoiceConsolidation = async() => {
        console.log(selectedInvoicesIds);
        const client_id = selectedRows[0]?.original?.client?.id;
        try{    
            if(!session?.accessToken) return;
            

            const body = {
                client_id,
                "invoice_ids": selectedInvoicesIds,
            }

            const resp = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/payments/superadmin/consolidate/`, {
                method: "POST",

                headers: {
                    "Authorization": `Token ${session?.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await resp.json();
            console.log(data);
            router.push("/dashboard/admin/consolidated-invoices")
        }catch(e){
            console.log(e);
        }
    }


    return (
        <div>
            
            <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4 py-4">
                    {/* Invoice ID Search */}
                    <Input
                        placeholder="Filter Invoice ID..."
                        value={(table.getColumn("invoice_id")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("invoice_id")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    {/* Month Filter */}
                    <Select onValueChange={(value) => table.getColumn("month")?.setFilterValue(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="2">February</SelectItem>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">May</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="8">August</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                    </Select>


                    {/* Status Filter */}
                    <Select
                        onValueChange={(value) => table.getColumn("status")?.setFilterValue(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Unpaid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <div>
                    <Button 
                        className="cursor-pointer"
                        onClick={handleInvoiceConsolidation}
                        disabled={selectedInvoicesIds.length === 0}
                    >
                        Consolidate
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )

}