"use client"

import { login } from './actions'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-[400px] p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl shadow-2xl shadow-black/50 overflow-hidden"
    >
      {/* Shine effect */}
      <motion.div 
        animate={{ 
          x: ['-100%', '200%'],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatDelay: 5,
          ease: "easeInOut" 
        }}
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] z-0 pointer-events-none"
      />
      
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10 relative z-10">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 mb-4 sm:mb-6 shadow-inner relative overflow-hidden"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-transparent opacity-50"
          />
          <ShieldCheck className="w-8 h-8 text-white/90 relative z-10" strokeWidth={1.5} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl font-semibold tracking-tight text-white mb-2"
        >
          Dhruvil's Portfolio
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-white/50"
        >
          Creator Studio Access
        </motion.p>
      </div>
      
      <form className="flex flex-col gap-4 sm:gap-5 relative z-10">
        
        {/* Email Field */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 100 }}
          className="space-y-2"
        >
          <label className="text-xs font-medium text-white/70 uppercase tracking-wider pl-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-purple-400 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              className="w-full rounded-xl px-12 py-3 sm:py-3.5 bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              name="email"
              type="email"
              placeholder="hello@example.com"
              required
            />
          </div>
        </motion.div>
        
        {/* Password Field */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
          className="space-y-2"
        >
          <label className="text-xs font-medium text-white/70 uppercase tracking-wider pl-1" htmlFor="password">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-purple-400 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              className="w-full rounded-xl px-12 py-3 sm:py-3.5 bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
        </motion.div>
        
        {/* Error Message */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 overflow-hidden"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {message}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="w-full mt-4"
        >
          <button
            formAction={login}
            className="group relative flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 sm:py-4 bg-white text-black font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
        
      </form>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[#050505] relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Animated Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" 
        />
      </div>

      <Suspense fallback={<div className="text-white/50 animate-pulse">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
