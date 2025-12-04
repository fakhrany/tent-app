'use client';

import Link from 'next/link';
import { Building2, MapPin, Home, Plus, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { api } from '@/lib/trpc';

export default function AdminDashboard() {
  // Fetch analytics data
  const { data: overview, isLoading } = api.analytics.getOverview.useQuery();
  const { data: adminStats } = api.admin.getStats.useQuery();
  
  // User & Conversation Stats
  const activityStats = [
    { 
      name: 'Total Users', 
      value: overview?.users.total || '0', 
      change: `+${overview?.users.new || 0} this month`,
      icon: Users, 
      href: '/admin/analytics', 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Active Users', 
      value: overview?.users.active || '0',
      change: 'Last 30 days',
      icon: Users, 
      href: '/admin/analytics', 
      color: 'bg-green-500' 
    },
    { 
      name: 'Total Conversations', 
      value: overview?.conversations.total || '0',
      change: `+${overview?.conversations.new || 0} this month`,
      icon: MessageSquare, 
      href: '/admin/analytics', 
      color: 'bg-purple-500' 
    },
    { 
      name: 'Active Conversations', 
      value: overview?.conversations.active || '0',
      change: 'Last 30 days',
      icon: MessageSquare, 
      href: '/admin/analytics', 
      color: 'bg-primary' 
    },
  ];

  // Property Stats
  const propertyStats = [
    { name: 'Total Developers', value: adminStats?.developers || '0', icon: Building2, href: '/admin/developers', color: 'bg-orange-500' },
    { name: 'Active Projects', value: adminStats?.projects || '0', icon: MapPin, href: '/admin/projects', color: 'bg-cyan-500' },
    { name: 'Available Units', value: adminStats?.units || '0', icon: Home, href: '/admin/units', color: 'bg-pink-500' },
  ];

  const quickActions = [
    { name: 'Add Developer', href: '/admin/developers/new', icon: Building2, description: 'Create a new real estate developer' },
    { name: 'Add Project', href: '/admin/projects/new', icon: MapPin, description: 'Add a new development project' },
    { name: 'Add Unit', href: '/admin/units/new', icon: Home, description: 'List a new property unit' },
  ];

  const recentActivity = [
    { action: 'New user registered', details: 'user@example.com', time: '5 min ago', user: 'System', icon: Users },
    { action: 'New conversation started', details: '3BR apartments in New Cairo', time: '12 min ago', user: 'Guest', icon: MessageSquare },
    { action: 'Added new unit', details: 'Skyline Residence #305', time: '2 hours ago', user: 'Admin', icon: Home },
    { action: 'Updated project', details: 'Capital Heights - Delivery date', time: '5 hours ago', user: 'Admin', icon: MapPin },
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-xl p-6 border border-primary/20">
        <h1 className="text-2xl font-semibold mb-2">Welcome to Tent Admin</h1>
        <p className="text-muted-foreground">
          Monitor platform activity and manage your real estate database.
        </p>
      </div>

      {/* User & Conversation Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          Platform Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activityStats.map((stat, idx) => (
            <Link
              key={idx}
              href={stat.href}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} className="text-white" strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm font-medium mb-1">{stat.name}</p>
                <p className="text-xs text-primary font-medium">{stat.change}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Property Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-primary" />
          Property Database
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {propertyStats.map((stat, idx) => (
            <Link
              key={idx}
              href={stat.href}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} className="text-white" strokeWidth={2} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      {overview && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Engagement Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Total Messages</p>
              <p className="text-3xl font-bold text-primary">{overview.messages.total.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Messages per Chat</p>
              <p className="text-3xl font-bold text-primary">{overview.conversations.avgMessages.toFixed(1)}</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Total Searches</p>
              <p className="text-3xl font-bold text-primary">{overview.searches.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <Plus size={20} className="text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-10 h-10 bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors">
                  <action.icon size={20} strokeWidth={2} className="text-primary group-hover:text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-0.5">{action.name}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <activity.icon size={14} className="text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time} • by {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Entry Guide */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Data Entry Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: 1, title: 'Add Developer', description: 'Start by creating a developer profile with logo and details' },
            { step: 2, title: 'Add Project', description: 'Create a project/compound under the developer with location and amenities' },
            { step: 3, title: 'Add Units', description: 'Add individual properties with specs, pricing, and payment plans' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 p-4 bg-secondary/50 rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
