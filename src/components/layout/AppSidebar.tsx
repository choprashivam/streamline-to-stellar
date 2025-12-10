import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  MessagesSquare,
  Ticket,
  Settings,
  Activity,
  Download,
  Shield,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/chatbot', icon: MessageSquare, label: 'Chatbot' },
  { to: '/chat-support', icon: MessagesSquare, label: 'Chat Support' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/troubleshoot', icon: Settings, label: 'Troubleshoot' },
  { to: '/app-installer', icon: Download, label: 'App Installer' },
  { to: '/health', icon: Activity, label: 'System Health' },
];

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Admin Portal' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isAdmin, currentAgent } = useApp();

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out',
        'bg-sidebar text-sidebar-foreground',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{ background: 'var(--gradient-sidebar)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border/30">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SYS AI</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-sidebar-accent/50',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/80'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className={cn('my-4 border-t border-sidebar-border/30', collapsed && 'mx-2')} />
            {!collapsed && (
              <p className="px-3 py-1 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                Admin
              </p>
            )}
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent/50',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/80'
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Info */}
      {currentAgent && !collapsed && (
        <div className="p-4 border-t border-sidebar-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-semibold">
                {currentAgent.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentAgent.username}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{currentAgent.hostname}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
      )}
    </aside>
  );
}
