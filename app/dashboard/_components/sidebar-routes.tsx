"use client";

import { Layout, OctagonAlert, Package, Truck, File, Warehouse, Users, CarFront, SignpostBigIcon, Contact, Boxes, Landmark, SlidersHorizontal, Bell, Route, Archive, PackageCheck, PackagePlus, BellIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import SidebarItem from './sidebar-item';
import { useSession } from 'next-auth/react';
import { useProfile } from '@/hooks/profile_hook';


const adminRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard/admin",
    },
    {
        icon: Warehouse,
        label: "Hubs",
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
        label: "Waybills",
        href: "/dashboard/admin/orders",
    },
    {
        icon: Boxes,
        label: "Manifests",
        href: "/dashboard/admin/shipments",
    },
    {
        icon: File,
        label: "Invoices",
        href: "/dashboard/admin/consolidated-invoices",
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
        icon: Route,
        label: "Intracity",
        href: "/dashboard/manager/intracity",
    },
    {
        icon: Boxes,
        label: "Waybills",
        href: "/dashboard/manager/orders",
    },
    {
        icon: PackagePlus,
        label: "Manifests",
        href: "/dashboard/manager/shipments",
    },
    {
        icon: Boxes,
        label: "Incoming Waybills",
        href: "/dashboard/manager/incoming-orders",
    },
    {
        icon: PackageCheck,
        label: "Incoming Manifests",
        href: "/dashboard/manager/incoming-shipments",
    },
    {
        icon: Truck,
        label: "Fullloads",
        href: "/dashboard/manager/fullloads",
    },
    {
        icon: BellIcon,
        label: "Notifications",
        href: "/dashboard/manager/notifications",
    },
    {
        icon: File,
        label: "Invoices",
        href: "/dashboard/manager/invoices",
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
        label: "Waybills",
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
    const { profile, isLoading } = useProfile();

    const aRoutes = adminRoutes;
    const mRoutes = managerRoutes;
    const pRoutes = partnerRoutes;

    useEffect(() => {
        const role = profile.role;
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