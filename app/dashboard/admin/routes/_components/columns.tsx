"use client"

import { RouteModel } from "@/lib/models/all_models"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<RouteModel>[] = [
    {
        accessorKey: "origins",
        header: "Origin",
    },
    {
        accessorKey: "destinations",
        header: "Destination",
    },
    {
        accessorKey: "base_weight_limit",
        header: "Base Weight Limit (kgs)",
    },
    {
        accessorKey: "base_price",
        header: "Base Price (KShs.)",
    },
    {
        accessorKey: "size_category",
        header: "Package Size",
    },
]