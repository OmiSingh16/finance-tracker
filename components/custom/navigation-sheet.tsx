// components/custom/navigation-sheet.tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { ChevronLeft } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = "NavigationSheetOverlay"

interface NavigationSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: "left" | "right"
}

const NavigationSheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  NavigationSheetContentProps
>(({ side = "left", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        className
      )}
      {...props}
    >
      {/* ✅ FIX: DialogTitle aur DialogDescription add kiya */}
      <SheetPrimitive.Title className="sr-only">
        Navigation Menu
      </SheetPrimitive.Title>
      <SheetPrimitive.Description className="sr-only">
        Main navigation menu
      </SheetPrimitive.Description>

      
      {/* Modern Navigation Header */}
<div className="flex items-center justify-between p-4 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg mb-4">
  <div className="flex items-center gap-3">
    <SheetClose className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-105">
      <ChevronLeft className="h-5 w-5" />
      <span className="sr-only">Close menu</span>
    </SheetClose>
    <div>
      <h3 className="font-bold text-lg">Finance</h3>
      <p className="text-blue-100 text-sm">Manage your money</p>
    </div>
  </div>
  
  <div className="bg-white/20 rounded-full p-1 border-2 border-white/30">
  </div>
</div>

      {/* Navigation Content */}
      <div className="flex-1">
        {children}
      </div>
    </SheetPrimitive.Content>
  </SheetPortal>
))
NavigationSheetContent.displayName = "NavigationSheetContent"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  NavigationSheetContent,
}