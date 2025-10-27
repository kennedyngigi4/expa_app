"use client"

import React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        enableRowSelection: true,
    })

    return (
        <div>
            <div className="flex flex-row justify-between py-4">
                <Input
                    placeholder="Filter Shipment ID..."
                    value={(table.getColumn("shipment_id")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("shipment_id")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <Button
                    onClick={async () => {
                        const selected = table
                            .getSelectedRowModel()
                            .rows.map((r) => r.original.id);
                        if (selected.length === 0) return;

                        const ids = selected.join(",");
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_APIURL}/deliveries/shipments/print/?ids=${ids}`,
                            {
                                method: "GET",
                                headers: { Accept: "application/pdf" },
                            }
                        );

                        if (!res.ok) {
                            const text = await res.text();
                            console.error("Failed to fetch PDF:", text);
                            alert("Failed to generate PDF — check logs.");
                            return;
                        }

                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "shipments.pdf";
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }}
                    disabled={table.getSelectedRowModel().rows.length === 0}
                >
                    Print Selected
                </Button>


            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead>
                                    <input
                                        type="checkbox"
                                        checked={table.getIsAllRowsSelected()}
                                        onChange={table.getToggleAllRowsSelectedHandler()}
                                    />
                                </TableHead>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={row.getIsSelected()}
                                            onChange={row.getToggleSelectedHandler()}
                                        />
                                    </TableCell>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="cursor-pointer"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="cursor-pointer"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}