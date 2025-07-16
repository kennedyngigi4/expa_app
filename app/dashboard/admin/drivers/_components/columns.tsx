"use client"

import { UserModel } from "@/lib/models/user_model"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<UserModel>[] = [
    {
        accessorKey: "full_name",
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
        cell: ({ row }) => {
            const formattedDate = new Date(row.getValue("date_joined")).toLocaleDateString("en-us", {
                year: "numeric", month: "short", day: "numeric"
            });

            return (
                <p>{formattedDate}</p>
            );
        }
    },
    {
        accessorKey: "",
        header: "Action",
    },
]