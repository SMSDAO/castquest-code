'use client'

import { ThemeToggle } from '../ui/theme-toggle'
import { Bell, Search, User } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
  return (
    <header className="glass-neo border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-lg glass-neo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
          </motion.button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <motion.button
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-neo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-400">System</p>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  )
}
