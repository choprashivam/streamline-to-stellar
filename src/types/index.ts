export interface Agent {
  agent_id: string;
  hostname: string;
  username: string;
  ip_address: string;
  os: string;
  online: boolean;
  last_seen_human?: string;
  offline_duration_display?: string;
  session_duration?: number;
  idle_human?: string;
  metrics: {
    cpu_usage: number;
    ram_usage: number;
    disk_usage: number;
  };
  device_info?: {
    manufacturer?: string;
    processor?: string;
  };
  top_app_today?: {
    name: string;
    seconds: number;
  };
  activity?: Record<string, ActivityEvent[]>;
  apps_usage?: Record<string, number>;
}

export interface ActivityEvent {
  ts: number;
  type: 'active' | 'idle';
}

export interface Ticket {
  ticket_id: string;
  issue: string;
  category: string;
  status: 'unresolved' | 'pending' | 'resolved';
  username?: string;
  hostname?: string;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  msg_id: string;
  user: string;
  role: 'user' | 'it';
  message: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'seen';
  url?: string;
}

export interface HealthReport {
  metrics: {
    cpu_usage: number;
    ram_usage: number;
    disk_usage: number;
    timestamp?: string;
  };
  updates: {
    pending_updates: boolean;
    reboot_required: boolean;
    update_details?: HotFix[];
  };
  critical_event_logs: EventLog[];
  alerts: string[];
}

export interface HotFix {
  HotFixID: string;
  InstalledOn: string;
}

export interface EventLog {
  EventID?: string;
  Source?: string;
  Message?: string;
}

export interface Service {
  name: string;
  display_name: string;
  service_name: string;
}

export interface AppRequest {
  id: string;
  app_name: string;
  username: string;
  hostname: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
}
