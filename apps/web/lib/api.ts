// lib/api.ts - API client with auth token management
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    // Only attempt refresh if not already calling an auth endpoint
    if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/verify-otp')) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          accessToken = data.accessToken;
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.accessToken);
          }
          // Retry original request
          headers['Authorization'] = `Bearer ${accessToken}`;
          const retryRes = await fetch(`${API_BASE}${endpoint}`, { ...options, headers, credentials: 'include' });
          if (retryRes.ok) {
            if (retryRes.status === 204) return null as T;
            return retryRes.json();
          }
        }
      } catch {}

      // Refresh failed: clear credentials cleanly WITHOUT forcing an infinite page reload
      accessToken = null;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('udyog-marg-auth');
        const isDemo = stored && (stored.includes('demo') || stored.includes('Rahul'));

        if (!isDemo) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('udyog-marg-auth');

          // Only redirect if on a protected route and NOT already on an auth or public page
          const path = window.location.pathname;
          const isAuthPage = path.startsWith('/login') || path.startsWith('/auth');
          const isPublicPage = path === '/' || path.startsWith('/public') || path.startsWith('/track') || path.startsWith('/help') || path.startsWith('/verify');

          if (!isAuthPage && !isPublicPage) {
            window.location.href = '/login';
          }
        }
      }
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: any) => request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  patch: <T>(endpoint: string, data?: any) => request<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),

  // Auth
  auth: {
    sendOTP: (identifier: string) => api.post<{ message: string }>('/auth/send-otp', { identifier }),
    verifyOTP: (identifier: string, otp: string) =>
      api.post<{ user: any; accessToken: string }>('/auth/verify-otp', { identifier, otp }),
    me: () => api.get<any>('/auth/me'),
    refresh: () => api.post<{ accessToken: string }>('/auth/refresh'),
    logout: () => api.post<{ message: string }>('/auth/logout'),
  },

  // Checklist
  checklist: {
    generate: (data: any) => api.post<any>('/checklist/generate', data),
    getPreview: (data: any) => api.post<any>('/checklist/preview', data),
  },

  // Applications
  applications: {
    list: (params?: any) => api.get<any[]>(`/applications${params ? '?' + new URLSearchParams(params) : ''}`),
    get: (id: string) => api.get<any>(`/applications/${id}`),
    create: (data: any) => api.post<any>('/applications', data),
    update: (id: string, data: any) => api.patch<any>(`/applications/${id}`, data),
    submit: (id: string) => api.post<any>(`/applications/${id}/submit`),
    getCAFData: (id: string) => api.get<any>(`/applications/${id}/caf-data`),
    deleteDraft: (id: string) => api.delete<any>(`/applications/${id}/draft`),
  },

  // Approvals
  approvals: {
    deptQueue: (params?: any) => api.get<any[]>(`/application-approvals/queue${params ? '?' + new URLSearchParams(params) : ''}`),
    startScrutiny: (id: string) => api.post<any>(`/application-approvals/${id}/start-scrutiny`),
    getQueries: (id: string) => api.get<any[]>(`/application-approvals/${id}/queries`),
    raiseQuery: (id: string, query: string, requestedDocs?: string[]) =>
      api.post<any>(`/application-approvals/${id}/queries`, { query, requestedDocs }),
    replyQuery: (id: string, queryId: string, reply: string) =>
      api.post<any>(`/application-approvals/${id}/queries/${queryId}/reply`, { reply }),
    resolveQuery: (id: string, queryId: string) =>
      api.patch<any>(`/application-approvals/${id}/queries/${queryId}/resolve`),
    recommend: (id: string, remarks?: string) =>
      api.post<any>(`/application-approvals/${id}/recommend`, { remarks }),
    approve: (id: string, remarks?: string) =>
      api.post<any>(`/application-approvals/${id}/approve`, { remarks }),
    reject: (id: string, remarks: string) => api.post<any>(`/application-approvals/${id}/reject`, { remarks }),
  },

  // Inspections
  inspections: {
    create: (data: any) => api.post<any>('/inspections', data),
    createJoint: (data: any) => api.post<any>('/inspections/joint', data),
    list: () => api.get<any[]>('/inspections'),
    complete: (id: string, data: any) => api.patch<any>(`/inspections/${id}/complete`, data),
  },

  // Schemes
  schemes: {
    list: () => api.get<any[]>('/schemes'),
    eligibility: (applicationId: string) => api.get<any[]>(`/schemes/eligibility/${applicationId}`),
  },

  // Documents
  documents: {
    list: (appId: string) => api.get<any[]>(`/documents/application/${appId}`),
    prevalidate: (appId: string) => api.post<any>(`/documents/prevalidate-application/${appId}`),
    upload: (appId: string, data: any) => api.post<any>(`/documents/upload/${appId}`, data),
    verify: (id: string, status: string, remarks?: string) => api.post<any>(`/documents/${id}/verify`, { status, remarks }),
  },

  // AI
  ai: {
    chat: (query: string, applicationId?: string, language?: string) =>
      api.post<any>('/ai/chat', { query, applicationId, language }),
    health: () => api.get<any>('/ai/health'),
  },

  // Analytics
  analytics: {
    state: () => api.get<any>('/analytics/state'),
    liveKPIs: () => api.get<any>('/analytics/live-kpis'),
    district: (districtId: string) => api.get<any>(`/analytics/district/${districtId}`),
    department: (deptId: string) => api.get<any>(`/analytics/department/${deptId}`),
  },

  // Notifications
  notifications: {
    list: (params?: any) => api.get<any>(`/notifications${params ? '?' + new URLSearchParams(params) : ''}`),
    markRead: (id: string) => api.patch<any>(`/notifications/${id}/read`),
    markAllRead: () => api.patch<any>('/notifications/read-all'),
  },

  // Grievances
  grievances: {
    list: () => api.get<any[]>('/grievances'),
    create: (data: any) => api.post<any>('/grievances', data),
    resolve: (id: string, resolution: string) =>
      api.patch<any>(`/grievances/${id}/resolve`, { resolution }),
  },
};
