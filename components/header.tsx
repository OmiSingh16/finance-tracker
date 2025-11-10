import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";

export const Header = () => {
  return (
    <header className="bg-linear-to-b from-blue-700 to-blue-500 px-4 py-4 lg:px-8 lg:py-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-8">
          
          <div className="lg:hidden">
            <Navigation />
          </div>

          <div className="hidden lg:flex items-center flex-1 justify-between">
            <div className="flex items-center gap-x-12">
              <HeaderLogo />
              <Navigation />
            </div>

            <div className="flex items-center border-l border-white/30 pl-4">
              <ClerkLoaded>
                <div className="flex items-center gap-x-2 bg-white/10 rounded-full px-2 py-1">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-6 h-6 border border-white/50"
                      }
                    }}
                  />
                </div>
              </ClerkLoaded>
              <ClerkLoading>
                <div className="flex items-center gap-x-2 bg-white/10 rounded-full px-2 py-1">
                  <Loader2 className="size-3 animate-spin text-white/70" />
                </div>
              </ClerkLoading>
            </div>
          </div>

          <div className="lg:hidden">
            <HeaderLogo />
          </div>
          
        </div>
        
         <WelcomeMsg/>        
      </div>
      
    </header>
  )
}