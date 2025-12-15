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
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
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
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out border-r border-border/50',
        'bg-sidebar',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Header with Logo and Theme Toggle */}
      <div className="flex items-center justify-between p-5 border-b border-border/30">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight">SYS AI</span>
              <p className="text-xs text-muted-foreground">IT Support</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Theme Toggle Button */}
      <div className={cn("px-3 pt-3", collapsed && "flex justify-center")}>
        <Button
          variant="outline"
          size={collapsed ? "icon" : "default"}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            "border-border/50 bg-secondary/50 hover:bg-secondary transition-all duration-200",
            !collapsed && "w-full justify-start gap-3"
          )}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-yellow-500" />
              {!collapsed && <span className="text-sm">Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-primary" />
              {!collapsed && <span className="text-sm">Dark Mode</span>}
            </>
          )}
        </Button>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-3 top-16 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-md hover:bg-secondary",
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <p className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", collapsed && "text-center")}>
          {collapsed ? '•••' : 'Navigation'}
        </p>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                'hover:bg-secondary/80',
                collapsed && 'justify-center',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className={cn('my-4 border-t border-border/30', collapsed && 'mx-2')} />
            <p className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", collapsed && "text-center")}>
              {collapsed ? '👑' : 'Admin'}
            </p>
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                    'hover:bg-accent/10',
                    collapsed && 'justify-center',
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Info */}
      {currentAgent && (
        <div className={cn("p-4 border-t border-border/30", collapsed && "px-2")}>
          <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-secondary/50", collapsed && "justify-center")}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                <span className="text-sm font-bold text-primary">
                  {currentAgent.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-sidebar pulse-online" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{currentAgent.username}</p>
                <p className="text-xs text-muted-foreground truncate">{currentAgent.hostname}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
