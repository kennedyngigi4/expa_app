"use client"

import { NotificationModel } from "@/lib/models/all_models"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<NotificationModel>[] = [
    {
        accessorKey: "title",
        header: "Notifications",
        cell: ({ row }) => {
            const notification = row.original;
            const formattedDate = new Date(notification.created_at).toLocaleDateString("en-us", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })

            return (
                <div>
                    <h1 className="text-primary font-bold">{notification.title} <span className="text-xs text-slate-500 font-light bg-slate-100 px-3 py-1 rounded-4xl">{formattedDate}</span></h1>
                    <p className="ps-1">{notification.message}</p>
                </div>
            );
        }
    },
]