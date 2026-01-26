// API Client for Laravel Backend (Sanctum SPA)
// Base URL SEM /api
const API_BASE_URL = 'http://localhost:8000/api';

// =====================
// Types
// =====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}


export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  preferred_language: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Accommodation {
  id: string;
  destination_id: string | null;
  destination?: Destination;
  name: string;
  slug: string;
  listing_type: 'hotel' | 'lodge' | 'guesthouse' | 'hostel' | 'apartment';
  short_description: string | null;
  description: string | null;
  address: string | null;
  image_url: string | null;
  gallery: string[] | null;
  amenities: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  price_per_night: number;
  currency: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  destination_id: string | null;
  destination?: Destination;
  name: string;
  slug: string;
  category: 'city_tour' | 'cultural' | 'beach' | 'nature' | 'food' | 'adventure';
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
  includes: string[] | null;
  duration_hours: number | null;
  max_participants: number | null;
  meeting_point: string | null;
  price: number;
  currency: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  user?: User;
  accommodation_id: string | null;
  accommodation?: Accommodation;
  experience_id: string | null;
  experience?: Experience;
  check_in: string | null;
  check_out: string | null;
  booking_date: string | null;
  guests: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  destinations_count: number;
  accommodations_count: number;
  experiences_count: number;
  bookings_count: number;
  users_count: number;
  revenue_total: number;
  revenue_this_month: number;
}

// =====================
// Core API request
// =====================

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:8000/api${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Resposta inválida da API');
  }

  if (!response.ok) {
    console.error('Erro na API', data);
    throw new Error(data.message || 'API error');
  }

  return data;
}


// =====================
// Auth API (Sanctum)
// =====================
export const authApi = {
 login: async (email: string, password: string) =>
  apiRequest<ApiResponse<{ user: User; token: string }>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  register: (email: string, password: string, fullName: string) =>
    apiRequest<{
      user: User;
      token: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        password_confirmation: password,
        full_name: fullName,
      }),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  me: () =>
    apiRequest<User>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    apiRequest<ApiResponse<User>>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// =====================
// Destinations API
// =====================
export const destinationsApi = {
  list: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest<PaginatedResponse<Destination>>(`/destinations?${query}`);
  },

  get: (slug: string) =>
    apiRequest<ApiResponse<Destination>>(`/destinations/${slug}`),

  create: (data: Partial<Destination>) =>
    apiRequest<ApiResponse<Destination>>('/admin/destinations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Destination>) =>
    apiRequest<ApiResponse<Destination>>(`/admin/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/destinations/${id}`, {
      method: 'DELETE',
    }),
};

// =====================
// (As APIs de accommodations, experiences, bookings, users e dashboard
// seguem exatamente o mesmo padrão — sem token, com cookies)
// =====================

// Accommodations API
export const accommodationsApi = {
  list: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    destination_id?: string;
    listing_type?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
    is_verified?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return apiRequest<PaginatedResponse<Accommodation>>(`/accommodations?${searchParams}`);
  },

  get: (slug: string) => apiRequest<ApiResponse<Accommodation>>(`/accommodations/${slug}`),

  create: (data: Partial<Accommodation>) =>
    apiRequest<ApiResponse<Accommodation>>('/admin/accommodations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Accommodation>) =>
    apiRequest<ApiResponse<Accommodation>>(`/admin/accommodations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/accommodations/${id}`, {
      method: 'DELETE',
    }),
};

// Experiences API
export const experiencesApi = {
  list: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    destination_id?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return apiRequest<PaginatedResponse<Experience>>(`/experiences?${searchParams}`);
  },

  get: (slug: string) => apiRequest<ApiResponse<Experience>>(`/experiences/${slug}`),

  create: (data: Partial<Experience>) =>
    apiRequest<ApiResponse<Experience>>('/admin/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Experience>) =>
    apiRequest<ApiResponse<Experience>>(`/admin/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/experiences/${id}`, {
      method: 'DELETE',
    }),
};

// Bookings API
export const bookingsApi = {
  list: (params?: { status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    return apiRequest<ApiResponse<Booking[]>>(`/bookings?${searchParams}`);
  },

  get: (id: string) => apiRequest<ApiResponse<Booking>>(`/bookings/${id}`),

  create: (data: {
    accommodation_id?: string;
    experience_id?: string;
    check_in?: string;
    check_out?: string;
    booking_date?: string;
    guests: number;
    special_requests?: string;
  }) =>
    apiRequest<ApiResponse<Booking>>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancel: (id: string) =>
    apiRequest<ApiResponse<Booking>>(`/bookings/${id}/cancel`, {
      method: 'PUT',
    }),

  // Admin
  listAll: (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    user_id?: string;
    from_date?: string;
    to_date?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return apiRequest<PaginatedResponse<Booking>>(`/admin/bookings?${searchParams}`);
  },

  updateStatus: (id: string, status: Booking['status']) =>
    apiRequest<ApiResponse<Booking>>(`/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Users API (Admin)
export const usersApi = {
  list: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return apiRequest<PaginatedResponse<User & { bookings_count?: number }>>(`/admin/users?${searchParams}`);
  },

  updateRole: (id: string, role: User['role']) =>
    apiRequest<ApiResponse<User>>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
};

// Dashboard API (Admin)
export const dashboardApi = {
  stats: () => apiRequest<ApiResponse<DashboardStats>>('/admin/stats'),
};
