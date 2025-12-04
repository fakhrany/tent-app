'use client';

import { useState } from 'react';
import Link from 'link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Home as HomeIcon, 
  MapPin, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Developers', href: '/admin/developers', icon: Building2 },
    { name: 'Projects', href: '/admin/projects', icon: MapPin },
    { name: 'Units', href: '/admin/units', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '280px' : '80px',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="bg-card border-r border-border flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HomeIcon size={18} className="text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">Tent Admin</h1>
                  <p className="text-xs text-muted-foreground">Data Entry Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:bg-secondary rounded-md transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 hover:bg-secondary rounded-md transition-colors mx-auto"
            >
              <Menu size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                  }
                  ${!sidebarOpen && 'justify-center'}
                `}
              >
                <item.icon size={20} strokeWidth={2} />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">DA</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Data Admin</p>
                <p className="text-xs text-muted-foreground">admin@tent.com</p>
              </div>
            )}
            {sidebarOpen && <LogOut size={16} className="text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {navigation.find(item => pathname?.startsWith(item.href))?.name || 'Admin Panel'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your real estate data
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
