// hooks/useSocket.ts - Real-time WebSocket hook
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth';

let globalSocket: Socket | null = null;
const statusListeners = new Set<(connected: boolean) => void>();

function notifyStatus(connected: boolean) {
  statusListeners.forEach((fn) => {
    try {
      fn(connected);
    } catch {}
  });
}

function getOrCreateSocket(token?: string | null): Socket {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
  if (!globalSocket) {
    globalSocket = io(wsUrl, {
      auth: { token: token || '' },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    globalSocket.on('connect', () => {
      notifyStatus(true);
    });

    globalSocket.on('disconnect', () => {
      notifyStatus(false);
    });

    globalSocket.on('connect_error', () => {
      notifyStatus(false);
    });

    globalSocket.on('reconnect', () => {
      notifyStatus(true);
    });
  } else if (token && globalSocket.connected) {
    globalSocket.emit('authenticate', token);
  }
  return globalSocket;
}

export function useSocket() {
  const { accessToken } = useAuthStore();
  const [isConnected, setIsConnected] = useState<boolean>(() => Boolean(globalSocket?.connected));

  useEffect(() => {
    const socket = getOrCreateSocket(accessToken);
    setIsConnected(socket.connected);

    const handleStatus = (connected: boolean) => {
      setIsConnected(connected);
    };

    statusListeners.add(handleStatus);

    if (accessToken && socket.connected) {
      socket.emit('authenticate', accessToken);
    }

    return () => {
      statusListeners.delete(handleStatus);
    };
  }, [accessToken]);

  const joinRoom = useCallback((room: string) => {
    globalSocket?.emit('join_room', room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    globalSocket?.emit('leave_room', room);
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    const s = getOrCreateSocket();
    s.on(event, handler);
    return () => {
      s.off(event, handler);
    };
  }, []);

  const off = useCallback((event: string, handler?: (...args: any[]) => void) => {
    globalSocket?.off(event, handler);
  }, []);

  return {
    socket: globalSocket,
    joinRoom,
    leaveRoom,
    on,
    off,
    isConnected,
  };
}

// Hook for application real-time timeline
export function useRealtimeTimeline(applicationId: string, onUpdate: (data: any) => void) {
  const { on, joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    if (!applicationId) return;
    const room = `application:${applicationId}`;
    joinRoom(room);

    const cleanup1 = on('application_status_updated', (data) => {
      if (data.appId === applicationId) onUpdate(data);
    });
    const cleanup2 = on('query_raised', (data) => {
      if (data.appId === applicationId) onUpdate({ ...data, eventType: 'query_raised' });
    });
    const cleanup3 = on('query_replied', (data) => {
      if (data.appId === applicationId) onUpdate({ ...data, eventType: 'query_replied' });
    });
    const cleanup4 = on('inspection_scheduled', (data) => {
      if (data.appId === applicationId) onUpdate({ ...data, eventType: 'inspection_scheduled' });
    });
    const cleanup5 = on('sla_breach', (data) => {
      if (data.appId === applicationId) onUpdate({ ...data, eventType: 'sla_breach' });
    });

    return () => {
      leaveRoom(room);
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
      cleanup4?.();
      cleanup5?.();
    };
  }, [applicationId, on, joinRoom, leaveRoom, onUpdate]);
}

// Hook for dept queue live updates
export function useLiveDeptQueue(onUpdate: (data: any) => void) {
  const { on } = useSocket();

  useEffect(() => {
    const cleanup1 = on('application_submitted', onUpdate);
    const cleanup2 = on('dept_queue_update', onUpdate);
    const cleanup3 = on('application_status_updated', onUpdate);

    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
    };
  }, [on, onUpdate]);
}

// Hook for live analytics
export function useLiveAnalytics(onRefresh: () => void) {
  const { on } = useSocket();

  useEffect(() => {
    const cleanup = on('analytics_refresh', onRefresh);
    return () => {
      cleanup?.();
    };
  }, [on, onRefresh]);
}

// Hook for SLA events
export function useSLAEvents(onSLAEvent: (data: any) => void) {
  const { on } = useSocket();

  useEffect(() => {
    const c1 = on('sla_at_risk', onSLAEvent);
    const c2 = on('sla_breach', onSLAEvent);
    const c3 = on('escalation_triggered', onSLAEvent);
    return () => { c1?.(); c2?.(); c3?.(); };
  }, [on, onSLAEvent]);
}
