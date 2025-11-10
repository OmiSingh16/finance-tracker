

'use client'
import { useUser } from "@clerk/nextjs"

export const WelcomeMsg = () => {
  const { user } = useUser();
  
  return(
    <>
      {/* For large screens - animated version */}
      <div className="hidden sm:block mb-6 sm:mb-8 ml-4 sm:ml-14">
        <div className="relative inline-block rounded-2xl p-1">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-gray-400 to-transparent animate-shimmer bg-size-[200%_100%]"></div>
          <div className="relative rounded-2xl bg-linear-to-r from-blue-900 to-blue-600 px-4 py-2 border border-gray-700">
            <h2 className="text-sm font-semibold text-white whitespace-nowrap">
              Welcome back {user?.firstName} 👋
            </h2>
          </div>
        </div>
      </div>

      {/* For small screens - simple version */}
      <div className="sm:hidden mb-8 ml-14 flex flex-col items-start space-y-1">
        <h2 className="text-base font-semibold text-white">
          Welcome back {user?.firstName} 👋
        </h2>
      </div>
    </>
  )
}
