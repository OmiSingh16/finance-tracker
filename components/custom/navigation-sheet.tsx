// // components/custom/navigation-sheet.tsx
// "use client"

// import * as React from "react"
// import * as SheetPrimitive from "@radix-ui/react-dialog"
// import { ChevronLeft, User } from "lucide-react"
// import { UserButton } from "@clerk/nextjs"

// import { cn } from "@/lib/utils"

// const Sheet = SheetPrimitive.Root
// const SheetTrigger = SheetPrimitive.Trigger
// const SheetClose = SheetPrimitive.Close
// const SheetPortal = SheetPrimitive.Portal

// const SheetOverlay = React.forwardRef<
//   React.ComponentRef<typeof SheetPrimitive.Overlay>,
//   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
// >(({ className, ...props }, ref) => (
//   <SheetPrimitive.Overlay
//     className={cn(
//       "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
//       className
//     )}
//     {...props}
//     ref={ref}
//   />
// ))
// SheetOverlay.displayName = "NavigationSheetOverlay"

// interface NavigationSheetContentProps
//   extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
//   side?: "left" | "right"
// }

// const NavigationSheetContent = React.forwardRef<
//   React.ComponentRef<typeof SheetPrimitive.Content>,
//   NavigationSheetContentProps
// >(({ side = "left", className, children, ...props }, ref) => (
//   <SheetPortal>
//     <SheetOverlay />
//     <SheetPrimitive.Content
//       ref={ref}
//       className={cn(
//         "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
//         className
//       )}
//       {...props}
//     >
//       {/* ✅ FIX: DialogTitle aur DialogDescription add kiya */}
//       <SheetPrimitive.Title className="sr-only">
//         Navigation Menu
//       </SheetPrimitive.Title>
//       <SheetPrimitive.Description className="sr-only">
//         Main navigation menu
//       </SheetPrimitive.Description>

      
// {/* Modern Navigation Header */}
// <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white rounded-xl mb-6 shadow-lg">
//   <div className="flex items-center gap-4">
//     <SheetClose className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 border border-white/20">
//       <ChevronLeft className="h-5 w-5" />
//       <span className="sr-only">Close menu</span>
//     </SheetClose>
//     <div>
//       <h3 className="font-bold text-xl">Finance Manager</h3>
//       <p className="text-blue-200 text-sm mt-1">Track & manage your finances</p>
//     </div>
//   </div>
  
//   <div className="flex items-center gap-3">
//     <div className=" sm:flex flex-col items-end">
//       <p className="text-white/80 text-sm">Welcome back</p>
//       <p className="font-semibold">User</p>
//     </div>
//     <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white/30 flex items-center justify-center shadow-lg">
//       <User className="h-5 w-5 text-white" />
//     </div>
//   </div>
// </div>

//       {/* Navigation Content */}
//       <div className="flex-1">
//         {children}
//       </div>
//     </SheetPrimitive.Content>
//   </SheetPortal>
// ))
// NavigationSheetContent.displayName = "NavigationSheetContent"

// export {
//   Sheet,
//   SheetTrigger,
//   SheetClose,
//   NavigationSheetContent,
// }




// components/custom/navigation-sheet.tsx
// components/custom/navigation-sheet.tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { ChevronLeft, User } from "lucide-react"
import { useUser } from "@clerk/nextjs"

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
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
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
>(({ side = "left", className, children, ...props }, ref) => {
  // ✅ useUser hook ko component ke andar use karo
  const { user, isLoaded } = useUser()

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-linear-to-b from-slate-50 to-white p-0 shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 left-0 h-full w-80 border-r border-slate-200/60 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          className
        )}
        {...props}
      >
        <SheetPrimitive.Title className="sr-only">
          Navigation Menu
        </SheetPrimitive.Title>
        <SheetPrimitive.Description className="sr-only">
          Main navigation menu
        </SheetPrimitive.Description>

        {/* Minimal Navigation Header */}
        <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm">
          {/* User Avatar - Left */}
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 overflow-hidden">
            {isLoaded && user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={user.fullName || "User"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-slate-600" />
            )}
          </div>

          {/* Title in center */}
          <div className="border-2 border-blue-300 bg-white rounded-md px-4 py-3 shadow-sm">
            <div className="text-center">
              <h1 className="font-bold text-lg text-blue-900 leading-none">Rupee</h1>
              <span className="font-semibold text-blue-700 text-sm leading-none">Rider</span>
            </div>
          </div>

          {/* Close Button - Right */}
          <SheetClose className="p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 group">
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            <span className="sr-only">Close menu</span>
          </SheetClose>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Custom Content Area */}
          {children && (
            <div className="space-y-4">
              {children}
            </div>
          )}
        </div>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
})
NavigationSheetContent.displayName = "NavigationSheetContent"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  NavigationSheetContent,
}