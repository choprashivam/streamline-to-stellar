import type { Agent, Ticket, ChatMessage, HealthReport, AppRequest } from '@/types';

// Mock agents data
export const mockAgents: Agent[] = [
  {
    agent_id: 'INL-PC-001-abc123',
    hostname: 'DESKTOP-DEV01',
    username: 'JohnDoe',
    ip_address: '192.168.1.101',
    os: 'Windows 11 Pro',
    online: true,
    last_seen_human: '2 min ago',
    session_duration: 28800,
    idle_human: '5 min',
    metrics: {
      cpu_usage: 45,
      ram_usage: 62,
      disk_usage: 78,
    },
    device_info: {
      manufacturer: 'Dell Inc.',
      processor: 'Intel Core i7-12700H',
    },
    top_app_today: {
      name: 'VS Code',
      seconds: 14400,
    },
  },
  {
    agent_id: 'INL-PC-002-def456',
    hostname: 'LAPTOP-SALES01',
    username: 'JaneSmith',
    ip_address: '192.168.1.102',
    os: 'Windows 10 Pro',
    online: true,
    last_seen_human: '1 min ago',
    session_duration: 18000,
    idle_human: '2 min',
    metrics: {
      cpu_usage: 23,
      ram_usage: 48,
      disk_usage: 45,
    },
    device_info: {
      manufacturer: 'HP Inc.',
      processor: 'AMD Ryzen 7 5800H',
    },
    top_app_today: {
      name: 'Microsoft Teams',
      seconds: 10800,
    },
  },
  {
    agent_id: 'INL-PC-003-ghi789',
    hostname: 'WORKSTATION-03',
    username: 'BobWilson',
    ip_address: '192.168.1.103',
    os: 'Windows 11 Enterprise',
    online: false,
    last_seen_human: '2 hours ago',
    offline_duration_display: '2 hr 15 min',
    metrics: {
      cpu_usage: 0,
      ram_usage: 0,
      disk_usage: 65,
    },
    device_info: {
      manufacturer: 'Lenovo',
      processor: 'Intel Core i5-11400',
    },
  },
  {
    agent_id: 'INL-PC-004-jkl012',
    hostname: 'FINANCE-PC01',
    username: 'AliceJohnson',
    ip_address: '192.168.1.104',
    os: 'Windows 10 Pro',
    online: true,
    last_seen_human: 'Just now',
    session_duration: 32400,
    idle_human: '0 sec',
    metrics: {
      cpu_usage: 67,
      ram_usage: 81,
      disk_usage: 92,
    },
    device_info: {
      manufacturer: 'Dell Inc.',
      processor: 'Intel Core i9-12900K',
    },
    top_app_today: {
      name: 'Excel',
      seconds: 21600,
    },
  },
];

// Mock tickets
export const mockTickets: Ticket[] = [
  {
    ticket_id: 'TKT-2024-001',
    issue: 'Unable to connect to the company VPN from home network',
    category: 'Network',
    status: 'unresolved',
    username: 'JohnDoe',
    hostname: 'DESKTOP-DEV01',
    created_at: '2024-12-10T09:30:00Z',
    priority: 'high',
  },
  {
    ticket_id: 'TKT-2024-002',
    issue: 'Outlook keeps crashing when opening attachments',
    category: 'Software',
    status: 'pending',
    username: 'JaneSmith',
    hostname: 'LAPTOP-SALES01',
    created_at: '2024-12-10T10:15:00Z',
    priority: 'medium',
  },
  {
    ticket_id: 'TKT-2024-003',
    issue: 'Printer not showing in available devices',
    category: 'Hardware',
    status: 'resolved',
    username: 'BobWilson',
    hostname: 'WORKSTATION-03',
    created_at: '2024-12-09T14:45:00Z',
    priority: 'low',
  },
  {
    ticket_id: 'TKT-2024-004',
    issue: 'System running extremely slow, high disk usage',
    category: 'Performance',
    status: 'unresolved',
    username: 'AliceJohnson',
    hostname: 'FINANCE-PC01',
    created_at: '2024-12-10T11:00:00Z',
    priority: 'high',
  },
];

// Mock chat messages
export const mockChatMessages: Record<string, ChatMessage[]> = {
  'INL-PC-001-abc123': [
    {
      msg_id: 'msg-001',
      user: 'INL-PC-001-abc123',
      role: 'user',
      message: 'Hi, I\'m having trouble with my VPN connection',
      timestamp: '2024-12-10T09:30:00Z',
      status: 'seen',
    },
    {
      msg_id: 'msg-002',
      user: 'INL-PC-001-abc123',
      role: 'it',
      message: 'Hello! I\'d be happy to help. Can you describe the error message you\'re seeing?',
      timestamp: '2024-12-10T09:31:00Z',
      status: 'delivered',
    },
    {
      msg_id: 'msg-003',
      user: 'INL-PC-001-abc123',
      role: 'user',
      message: 'It says "Connection timed out" when I try to connect',
      timestamp: '2024-12-10T09:32:00Z',
      status: 'seen',
    },
  ],
  'INL-PC-002-def456': [
    {
      msg_id: 'msg-004',
      user: 'INL-PC-002-def456',
      role: 'user',
      message: 'Outlook keeps freezing, please help!',
      timestamp: '2024-12-10T10:15:00Z',
      status: 'delivered',
    },
  ],
};

// Mock health report
export const mockHealthReport: HealthReport = {
  metrics: {
    cpu_usage: 45,
    ram_usage: 62,
    disk_usage: 78,
    timestamp: '2024-12-10T12:00:00Z',
  },
  updates: {
    pending_updates: true,
    reboot_required: false,
    update_details: [
      { HotFixID: 'KB5034441', InstalledOn: '2024-12-05' },
      { HotFixID: 'KB5034123', InstalledOn: '2024-12-01' },
      { HotFixID: 'KB5033920', InstalledOn: '2024-11-28' },
    ],
  },
  critical_event_logs: [
    {
      EventID: '1001',
      Source: 'Application Error',
      Message: 'Faulting application name: chrome.exe, version: 120.0.6099.130',
    },
  ],
  alerts: [
    'Disk usage is above 75%',
    '3 pending Windows updates',
  ],
};

// Mock app requests
export const mockAppRequests: AppRequest[] = [
  {
    id: 'req-001',
    app_name: 'Visual Studio Code',
    username: 'JohnDoe',
    hostname: 'DESKTOP-DEV01',
    status: 'pending',
    requested_at: '2024-12-10T08:00:00Z',
  },
  {
    id: 'req-002',
    app_name: 'Slack',
    username: 'JaneSmith',
    hostname: 'LAPTOP-SALES01',
    status: 'approved',
    requested_at: '2024-12-09T15:30:00Z',
  },
];

// Services that can be restarted
export const services = [
  { name: 'Printer Service', display_name: 'Print Spooler', service_name: 'Spooler' },
  { name: 'Wi-Fi Service', display_name: 'WLAN AutoConfig', service_name: 'WlanSvc' },
  { name: 'Windows Update', display_name: 'Windows Update', service_name: 'wuauserv' },
  { name: 'Remote Desktop', display_name: 'Remote Desktop Services', service_name: 'TermService' },
  { name: 'DNS Client', display_name: 'DNS Client', service_name: 'Dnscache' },
  { name: 'DHCP Client', display_name: 'DHCP Client', service_name: 'Dhcp' },
  { name: 'Windows Firewall', display_name: 'Windows Firewall', service_name: 'mpssvc' },
];

// Available apps for installation
export const availableApps = [
  { name: 'Visual Studio Code', category: 'Development' },
  { name: 'Git', category: 'Development' },
  { name: 'Node.js', category: 'Development' },
  { name: 'Slack', category: 'Communication' },
  { name: 'Zoom', category: 'Communication' },
  { name: 'Microsoft Teams', category: 'Communication' },
  { name: '7-Zip', category: 'Utilities' },
  { name: 'VLC Media Player', category: 'Media' },
  { name: 'Adobe Reader', category: 'Productivity' },
  { name: 'Notepad++', category: 'Utilities' },
];
