"use client"
import { LISTNAVITEMS } from '@/lib/constant/nav-items';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'




const NavItem = ({ icon: Icon, active, onClick }: { icon: LucideIcon; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} className="flex-1 cursor-pointer h-full flex items-center justify-center p-2 relative group">
    {active && (
      <div className="absolute top-2 bottom-2 left-2 right-2 bg-blue-50/50 rounded-xl border-2 border-blue-200 pointer-events-none" />
    )}
    <Icon
      className={cn(
        "w-7 h-7 transition-colors",
        active ? "text-blue-500 fill-blue-500" : "text-muted-foreground group-hover:text-blue-400",
      )}
      strokeWidth={2.5}
    />
  </button>
)

function BottomNavigation() {
const PATHNAME = usePathname();
const isActive = PATHNAME;
const router = useRouter();
  return (

  <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-border h-20 pb-4">
    <div className="container max-w-md mx-auto h-full flex items-center justify-between px-2">
{LISTNAVITEMS.map((item) => (
  <NavItem key={item.name} icon={item.icon} active={isActive === item.href} onClick={() => router.push(item.href)} />
))}

    </div>
  </nav>
)  
}

export default BottomNavigation