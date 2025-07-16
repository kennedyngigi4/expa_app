"use client"

import { UserModel } from "@/lib/models/user_model"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";


export const columns: ColumnDef<UserModel>[] = [
    {
        accessorKey: "full_name",
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
        cell: ({row}) => {
            const user = row.original;

            return (
                <Link href={`/dashboard/admin/user/${user.id}`}>
                    <MoreHorizontal />
                </Link>
            );
        }
    },
]