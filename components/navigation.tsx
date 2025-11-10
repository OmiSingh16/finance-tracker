'use client'

import { usePathname } from "next/navigation";
import { NavButton } from "@/components/nav-button";
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { NavigationSheetContent } from '@/components/custom/navigation-sheet'; // Custom component
import { useMedia } from 'react-use'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, Home, TrendingUp, Landmark, Folder, Settings, Wallet } from "lucide-react";

const routes = [
  {
    href: '/',
    label: 'Overview',
    icon: <Home className="h-5 w-5" />
  },
  {
    href: '/transactions',
    label: 'Transactions',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    href: '/accounts',
    label: 'Accounts',
    icon: <Landmark className="h-5 w-5" />
  },
  {
    href: '/categories',
    label: 'Categories',
    icon: <Folder className="h-5 w-5" />
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />
  },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            className="lg:hidden font-normal bg-white/10 hover:bg-white/20 hover:text-white border-white/20 text-white focus:bg-white/30 transition-all duration-200 hover:scale-105"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        
        {/* Custom Navigation Sheet */}
        <NavigationSheetContent side='left' className="px-0">
          <nav className="flex flex-col gap-1 p-4">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? 'secondary' : 'ghost'}
                onClick={() => onClick(route.href)}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                  route.href === pathname 
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-sm' 
                    : 'hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    route.href === pathname ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {route.icon}
                  </div>
                  <span className="font-medium">{route.label}</span>
                </div>
              </Button>
            ))}
          </nav>

          {/* Quick Stats Section */}
          <div className="mt-auto p-4 border-t border-slate-200">
            <div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Quick Stats</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Total Balance</span>
                  <span className="font-semibold">₹5.8L</span>
                </div>
                <div className="flex justify-between">
                  <span>Accounts</span>
                  <span className="font-semibold">4</span>
                </div>
              </div>
            </div>
          </div>
        </NavigationSheetContent>
      </Sheet>
    )
  }

  return (
    <nav className="hidden lg:flex items-center w-full">
      <div className="flex items-center gap-x-8 ml-40">
        {routes.map((route) => (
          <NavButton
            key={route.href}
            href={route.href}
            label={route.label}
            isActive={pathname === route.href}
          /> 
        ))}
      </div>
    </nav>
  );
}