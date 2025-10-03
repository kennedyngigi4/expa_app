"use client";

import { Layout, OctagonAlert, Package, Truck, File, Warehouse, Users, CarFront, SignpostBigIcon, Contact, Boxes, Landmark, SlidersHorizontal, Bell } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import SidebarItem from './sidebar-item';
import { useSession } from 'next-auth/react';


const adminRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard/admin",
    },
    {
        icon: Warehouse,
        label: "Offices",
        href: "/dashboard/admin/offices",
    },
    {
        icon: Users,
        label: "Employees",
        href: "/dashboard/admin/employees",
    },
    {
        icon: CarFront,
        label: "Drivers",
        href: "/dashboard/admin/drivers",
    },
    {
        icon: SignpostBigIcon,
        label: "Routes",
        href: "/dashboard/admin/routes",
    },
    {
        icon: Contact,
        label: "Clients",
        href: "/dashboard/admin/clients",
    },
    {
        icon: Package,
        label: "Orders",
        href: "/dashboard/admin/orders",
    },
    {
        icon: Boxes,
        label: "Shipments",
        href: "/dashboard/admin/shipments",
    },
    {
        icon: Landmark,
        label: "Payments",
        href: "/dashboard/admin/payments",
    },

    {
        icon: SlidersHorizontal,
        label: "Settings",
        href: "/dashboard/admin/settings",
    }
]

const managerRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard/manager",
    },
    {
        icon: Package,
        label: "Orders",
        href: "/dashboard/manager/orders",
    },
    {
        icon: Truck,
        label: "Shipments",
        href: "/dashboard/manager/shipments",
    },
    {
        icon: Truck,
        label: "Incoming Shipments",
        href: "/dashboard/manager/incoming-shipments",
    },
    {
        icon: File,
        label: "Invoices",
        href: "/dashboard/manager/invoices",
    },
    {
        icon: File,
        label: "Fullloads",
        href: "/dashboard/manager/fullloads",
    },
    {
        icon: OctagonAlert,
        label: "Reports",
        href: "/dashboard/manager/reports",
    },
]

const partnerRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard/partner",
    },
    {
        icon: Package,
        label: "Orders",
        href: "/dashboard/partner/orders",
    },
    {
        icon: File,
        label: "Invoices",
        href: "/dashboard/partner/invoices",
    },
    {
        icon: Bell,
        label: "Notifications",
        href: "/dashboard/partner/notifications",
    }
]

const SidebarRoutes = () => {
    const [role, setRole] = useState("");
    const {data:session} = useSession();
    const aRoutes = adminRoutes;
    const mRoutes = managerRoutes;
    const pRoutes = partnerRoutes;

    useEffect(() => {
        const role = String(session?.user?.role);
        setRole(role);
    }, [session]);

    return (
        <div className="flex flex-col w-full">
            { role === "admin" && (
                <>
                    {
                        aRoutes.map((route) => (
                            <SidebarItem
                                key={route.label}
                                label={route.label}
                                href={route.href}
                                icon={route.icon}
                            />
                    ))}
                </>
            )}


            {/* manager routes */}
            {role === "manager" && (
                <>
                    {
                        mRoutes.map((route) => (
                            <SidebarItem
                                key={route.label}
                                label={route.label}
                                href={route.href}
                                icon={route.icon}
                            />
                        ))}
                </>
            )}


            {/* partner routes */}
            {role === "partner_shop" && (
                <>
                    {
                        pRoutes.map((route) => (
                            <SidebarItem
                                key={route.label}
                                label={route.label}
                                href={route.href}
                                icon={route.icon}
                            />
                        ))}
                </>
            )}
        </div>
    );
}

export default SidebarRoutes