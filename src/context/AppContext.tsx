import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Agent, Ticket, ChatMessage } from '@/types';
import { mockAgents, mockTickets, mockChatMessages } from '@/lib/mock-data';

interface AppContextType {
  // Agent state
  agents: Agent[];
  currentAgent: Agent | null;
  setCurrentAgent: (agent: Agent | null) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;

  // Tickets
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'ticket_id' | 'created_at'>) => void;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;

  // Chat
  chatMessages: Record<string, ChatMessage[]>;
  addChatMessage: (agentId: string, message: Omit<ChatMessage, 'msg_id' | 'timestamp'>) => void;
  selectedChatAgent: string | null;
  setSelectedChatAgent: (agentId: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [agents] = useState<Agent[]>(mockAgents);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(mockAgents[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(mockChatMessages);
  const [selectedChatAgent, setSelectedChatAgent] = useState<string | null>(null);

  const addTicket = useCallback((ticket: Omit<Ticket, 'ticket_id' | 'created_at'>) => {
    const newTicket: Ticket = {
      ...ticket,
      ticket_id: `TKT-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: Ticket['status']) => {
    setTickets(prev =>
      prev.map(t => (t.ticket_id === ticketId ? { ...t, status } : t))
    );
  }, []);

  const addChatMessage = useCallback(
    (agentId: string, message: Omit<ChatMessage, 'msg_id' | 'timestamp'>) => {
      const newMessage: ChatMessage = {
        ...message,
        msg_id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), newMessage],
      }));
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        agents,
        currentAgent,
        setCurrentAgent,
        isAdmin,
        setIsAdmin,
        tickets,
        addTicket,
        updateTicketStatus,
        chatMessages,
        addChatMessage,
        selectedChatAgent,
        setSelectedChatAgent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
