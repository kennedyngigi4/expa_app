"use client";

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';


interface SidebarItemProps {
    label: string;
    href: string;
    icon: LucideIcon;
}


const SidebarItem = ({ label, href, icon: Icon } : SidebarItemProps) => {

    const pathname = usePathname();
    const router = useRouter();

    const isActive = (pathname === "/" && href === "/") || pathname === href || pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

  return (
      <button
          onClick={onClick}
          type="button"
          className={cn("flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all cursor-pointer hover:text-slate-600 hover:bg-slate-300/20", isActive && "text-amber-600 bg-amber-200/20 hover:bg-amber-200/20 hover:text-amber-700")}
      >
          <div className="flex items-center gap-x-2 py-4">
              <Icon size={22} className={cn("text-slate-500", isActive && "text-amber-700")} />
              {label}
          </div>
          <div className={cn("ml-auto opacity-0 border-2 border-amber-600 h-full transition-all", isActive && "opacity-100")} />
      </button>
  )
}

export default SidebarItem