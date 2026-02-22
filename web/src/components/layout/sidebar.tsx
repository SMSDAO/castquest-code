'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Code2,
  TestTube,
  Rocket,
  Settings,
  FileCode,
  GitBranch,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Code2, label: 'Code Analysis', href: '/analysis' },
  { icon: FileCode, label: 'Code Generator', href: '/generator' },
  { icon: TestTube, label: 'Testing', href: '/testing' },
  { icon: GitBranch, label: 'Components', href: '/components' },
  { icon: Activity, label: 'Orchestrator', href: '/orchestrator' },
  { icon: Rocket, label: 'Deployment', href: '/deployment' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      className="glass-neo relative flex flex-col border-r border-white/10"
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/10">
        <motion.div
          className="flex items-center gap-3"
          animate={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-neo-blue">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-xl font-bold text-neo-glow">AiCode</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-neo">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 shadow-glow-sm'
                    : 'hover:bg-white/5'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-neon-blue' : 'text-gray-400'
                  }`}
                />
                {!collapsed && (
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-neon-blue' : 'text-gray-300'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass-neo flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-neon-blue" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-neon-blue" />
        )}
      </motion.button>
    </motion.aside>
  )
}
