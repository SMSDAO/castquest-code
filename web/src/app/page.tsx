import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardStats, RecentActivity } from '@/components/dashboard/dashboard-stats'

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold mb-4 text-neo-glow animate-float">
            Welcome to AiCode Admin
          </h1>
          <p className="text-xl text-gray-400">
            Powerful AI-driven code management with modern Neo aesthetics
          </p>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          
          {/* Quick Actions */}
          <div className="card-neo p-6">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-neo text-white">
                Analyze Code
              </button>
              <button className="btn-neo text-white">
                Run Tests
              </button>
              <button className="btn-neo text-white">
                Generate Code
              </button>
              <button className="btn-neo text-white">
                Deploy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
