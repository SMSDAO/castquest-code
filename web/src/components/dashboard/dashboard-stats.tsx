'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  Code2,
  TestTube,
  Rocket,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  color: 'blue' | 'purple' | 'green' | 'pink'
}

const colorClasses = {
  blue: 'from-neon-blue/20 to-neon-blue/5 border-neon-blue/30 shadow-neo-blue',
  purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 shadow-neo-purple',
  green: 'from-neon-green/20 to-neon-green/5 border-neon-green/30 shadow-neo-green',
  pink: 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30 shadow-neo-pink',
}

const iconColors = {
  blue: 'text-neon-blue',
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  pink: 'text-neon-pink',
}

function StatCard({ icon: Icon, title, value, change, trend, color }: StatCardProps) {
  return (
    <motion.div
      className={`card-neo bg-gradient-to-br ${colorClasses[color]} p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          {change && (
            <div className="flex items-center gap-1">
              <TrendingUp
                className={`w-4 h-4 ${trend === 'up' ? 'text-neon-green' : 'text-neon-pink'}`}
              />
              <span className="text-sm text-gray-400">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/5 ${iconColors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

export function DashboardStats() {
  const stats = [
    {
      icon: Code2,
      title: 'Code Analyzed',
      value: '1,234',
      change: '+12% from last week',
      trend: 'up' as const,
      color: 'blue' as const,
    },
    {
      icon: TestTube,
      title: 'Tests Passed',
      value: '98.5%',
      change: '+2.3% from last week',
      trend: 'up' as const,
      color: 'green' as const,
    },
    {
      icon: Activity,
      title: 'Active Workflows',
      value: '24',
      change: '3 running now',
      color: 'purple' as const,
    },
    {
      icon: Rocket,
      title: 'Deployments',
      value: '156',
      change: '+8 this week',
      trend: 'up' as const,
      color: 'pink' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  )
}

export function RecentActivity() {
  const activities = [
    {
      icon: CheckCircle,
      title: 'Code Analysis Completed',
      description: 'Analyzed 45 files in project/src',
      time: '2 minutes ago',
      color: 'text-neon-green',
    },
    {
      icon: Clock,
      title: 'Test Suite Running',
      description: 'Running 31 tests across 5 suites',
      time: '5 minutes ago',
      color: 'text-neon-blue',
    },
    {
      icon: Rocket,
      title: 'Deployment Started',
      description: 'Deploying to Vercel production',
      time: '10 minutes ago',
      color: 'text-neon-purple',
    },
    {
      icon: AlertCircle,
      title: 'Linting Issues Found',
      description: '3 issues detected, auto-fixing',
      time: '15 minutes ago',
      color: 'text-neon-yellow',
    },
  ]

  return (
    <div className="card-neo p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-neon-blue" />
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-2 rounded-lg bg-white/5 ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{activity.title}</h3>
                <p className="text-sm text-gray-400">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
