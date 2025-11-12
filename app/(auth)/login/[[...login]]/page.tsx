// app/(auth)/login/page.tsx
'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function LoginPage() {
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
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-16 h-16 bg-indigo-300 rounded-full opacity-30"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-12 h-12 bg-purple-200 rounded-lg opacity-40 rotate-45"
          animate={{ y: [0, -15, 0], rotate: [45, 90, 45] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
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
              <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                RupeeRider
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Take control of your rupees
            </p>
          </motion.div>

          {/* Clerk SignIn Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SignIn path='/login'/>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-slate-500 text-sm">
              Secure • Reliable • Made with ❤️ for India
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}