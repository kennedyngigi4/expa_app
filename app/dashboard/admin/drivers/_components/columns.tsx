"use client"

import { UserModel } from "@/lib/models/user_model"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<UserModel>[] = [
    {
        accessorKey: "fullname",
        header: "Fullname",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "date_joined",
        header: "Date Joined",
    },
]