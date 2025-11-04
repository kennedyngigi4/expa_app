"use client"

import React, { useEffect, useState} from "react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ShipmentModal from "./shipment-modal"
import { APIServices } from "@/lib/utils/api_services"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const { data:session} = useSession();
    const router = useRouter();
    
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });



    // Handling selection and shipment creation
    const selectedPackageIds = table.getFilteredSelectedRowModel().rows.map((row) => row?.original?.id);
    const [isCreatingShipment, setIsCreatingShipment] = useState(false);
    const [ officeOptions, setOfficeOptions ] = useState([]);
    const [ courierOptions, setCourierOptions ] = useState([]);


    useEffect(() => {
        const fetchData = async() => {
            if(!session?.accessToken){
                throw new Error("You must be logged in.")
            }

            const offices = await APIServices.get("account/offices", session?.accessToken);
            const couriers = await APIServices.get("account/couriers", session?.accessToken);
            setOfficeOptions(offices);
            setCourierOptions(couriers)
        }
        fetchData()
    }, [session]);

    const handleShipmentSubmit = async ({ packages, shipment_type, destination_office, courier, handover_required }: { packages: string[], shipment_type: string, destination_office?: string | null, courier: string; handover_required: string;}) => {
        
        console.log(selectedPackageIds);
        
        try{
            if(!session?.accessToken){
                throw new Error("You must be logged in.");
            }

            const formData = new FormData();
            packages.forEach(id => formData.append("packages", id));
            formData.append("shipment_type", shipment_type);
            formData.append("courier", courier);
            formData.append("requires_handover", handover_required);
            if (shipment_type === "transfer" && destination_office) {
                formData.append("destination_office", destination_office);
            }

            const res = await APIServices.post("deliveries/manager/create_shipment/", session?.accessToken, formData);
            console.log(res);
            if(res.status === "created"){
                toast.success("Shipment created successfully.");
                router.push("/dashboard/manager/shipments");
            } else {
                toast.error("Failed, an error occurred.");
            }

        } catch(e){
            console.error("Error creating shipment:", e);
        }
    }

    


    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter Order ID..."
                    value={(table.getColumn("package_id")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("package_id")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />


                <Button
                    onClick={() => setIsCreatingShipment(true)}
                    disabled={selectedPackageIds.length === 0}
                >
                    Create Shipment
                </Button>

                <ShipmentModal
                    isOpen={isCreatingShipment}
                    onOpenChange={setIsCreatingShipment}
                    selectedPackageIds={selectedPackageIds}
                    offices={officeOptions}
                    couriers={courierOptions}
                    onSubmit={handleShipmentSubmit}
                />


            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
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
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                <div className="flex items-center space-x-3">
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
        </div>
    )
}