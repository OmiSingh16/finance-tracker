// app/(auth)/signup/page.tsx
'use client';

import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Dotted Pattern */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #cbd5e1 2%, transparent 0%), 
                            radial-gradient(circle at 75px 75px, #cbd5e1 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
            backgroundPosition: '0 0, 50px 50px',
          }}
        />
        
        {/* Floating Shapes */}
        <motion.div
          className="absolute top-32 right-20 w-24 h-24 bg-green-200 rounded-full opacity-20"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-16 w-14 h-14 bg-amber-300 rounded-full opacity-30"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-10 h-10 bg-rose-200 rounded-lg opacity-40 -rotate-45"
          animate={{ y: [0, -20, 0], rotate: [-45, -90, -45] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">
                RupeeRider
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Start your financial journey today
            </p>
          </motion.div>

          {/* Clerk SignUp Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SignUp path='/signup'/>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60"
          >
            <h3 className="font-semibold text-slate-800 mb-3 text-center">
              Why join RupeeRider?
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Track Expenses
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Save Money
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Smart Analytics
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Budget Planning
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}