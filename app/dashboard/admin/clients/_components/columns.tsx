"use client"

import { UserModel } from "@/lib/models/user_model"
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<UserModel>[] = [
    {
        accessorKey: "fullname",
        header: "Full Name",
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
        accessorKey: "account_type",
        header: "Account Type",
    },
]