// API Client for Laravel Backend (Sanctum SPA)
// Base URL SEM /api
export const API_BASE_URL = 'http://localhost:8000/api';
export const BACKEND_URL = 'http://localhost:8000';

// =====================
// Types
// =====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}


export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UploadResponse {
  success: boolean;
  url: string;
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

export async function getCsrfCookie() {
  await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include', // ESSENCIAL
  });
}

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
    credentials: 'include',
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
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== ''
    )
  );

  const query = new URLSearchParams(cleanParams).toString();
  return apiRequest(`/destinations${query ? `?${query}` : ''}`);
},


  get: (slug: string) =>
    apiRequest<ApiResponse<Destination>>(`/destinations/${slug}`),

 create: async (data: Partial<Destination> & { image_file?: File }) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image_file' && value instanceof File) {
        formData.append('image_file', value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/admin/destinations`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // NUNCA colocar 'Content-Type', o FormData faz isso
    },
    credentials: 'include', // <<< ESSENCIAL pro Laravel Sanctum
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Erro ao criar destination', text);
    throw new Error('Falha ao criar destino');
  }

  return res.json() as Promise<ApiResponse<Destination>>;
},

  update: async (id: string, data: Partial<Destination> & { image_file?: File }) => {
  const formData = new FormData();

  // Append _method=PUT antes de mandar pro Laravel
  formData.append('_method', 'PUT');

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image_file' && value instanceof File) {
        formData.append('image_file', value); // arquivo
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/admin/destinations/${id}`, {
    method: 'POST', // Laravel interpreta _method=PUT
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // NÃO colocar 'Content-Type'
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Erro ao atualizar destination', text);
    throw new Error('Falha ao atualizar destino');
  }

  return res.json() as Promise<ApiResponse<Destination>>;
},


  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/destinations/${id}`, {
      method: 'DELETE',
    }),

  featured: () =>
  apiRequest<ApiResponse<Destination[]>>(
    '/destinations?is_featured=true&per_page=8'
  ),
};

// =====================
// Accommodations API
// =====================
export const accommodationsApi = {
  list: (params?: Record<string, any>) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );

    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/accommodations${query ? `?${query}` : ''}`);
  },

  get: (slug: string) =>
    apiRequest<ApiResponse<Accommodation>>(`/accommodations/${slug}`),
// =====================
// Accommodations API - FUNÇÃO CREATE COMPLETA
// =====================
create: async (data: Partial<Accommodation> & { image_file?: File }) => {
  console.log('🔍 === API CREATE DEBUG - INÍCIO ===');
  console.log('📦 Dados recebidos:', data);
  
  const formData = new FormData();
  const token = localStorage.getItem('token');
  
  console.log('🔑 Token disponível:', token ? '✅ SIM' : '❌ NÃO');
  
  // 1. Adicionar todos os campos ao FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      console.log(`📝 Processando ${key}:`, value, 'Tipo:', typeof value);
      
      if (key === 'image_file' && value instanceof File) {
        console.log(`🖼️  Adicionando arquivo: ${value.name} (${value.size} bytes)`);
        formData.append('image_file', value);
      } else if (Array.isArray(value)) {
        const arrayValue = value.join(', ');
        console.log(`📋 Array ${key} -> string: "${arrayValue}"`);
        formData.append(key, arrayValue);
      } else if (typeof value === 'boolean') {
        // Laravel espera '1'/'0' ou 'true'/'false' para boolean
        const boolValue = value ? '1' : '0';
        console.log(`⚡ Boolean ${key} -> "${boolValue}"`);
        formData.append(key, boolValue);
      } else {
        const stringValue = String(value);
        console.log(`📄 ${key} -> string: "${stringValue}"`);
        formData.append(key, stringValue);
      }
    } else {
      console.log(`🚫 ${key}: undefined/null (ignorado)`);
    }
  });
  
  // 2. Verificar campos obrigatórios
  console.log('🔎 === VERIFICAÇÃO DE CAMPOS ===');
  const requiredFields = ['name', 'slug', 'listing_type', 'price_per_night'];
  let allRequiredPresent = true;
  
  requiredFields.forEach(field => {
    const value = formData.get(field);
    if (value) {
      console.log(`✅ ${field}: "${value}"`);
    } else {
      console.log(`❌ ${field}: AUSENTE!`);
      allRequiredPresent = false;
    }
  });
  
  if (!allRequiredPresent) {
    console.error('🚨 Campos obrigatórios faltando! Abortando...');
    throw new Error('Campos obrigatórios não preenchidos');
  }
  
  // 3. Mostrar todo o conteúdo do FormData
  console.log('📋 === CONTEÚDO COMPLETO DO FORMDATA ===');
  for (let pair of formData.entries()) {
    console.log(`   ${pair[0]} = ${pair[1]}`);
  }
  
  // 4. Configurar headers
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Header Authorization adicionado');
  }
  
  // 5. Fazer a requisição
  console.log('🚀 === ENVIANDO REQUISIÇÃO ===');
  console.log('🌐 URL:', `${API_BASE_URL}/admin/accommodations`);
  console.log('📤 Método: POST');
  console.log('📎 Headers:', headers);
  console.log('🔗 Credentials: include');
  
  const startTime = Date.now();
  
  try {
    const res = await fetch(`${API_BASE_URL}/admin/accommodations`, {
      method: 'POST',
      body: formData,
      headers: headers,
      credentials: 'include',
    });
    
    const endTime = Date.now();
    console.log(`⏱️  Tempo de resposta: ${endTime - startTime}ms`);
    
    console.log('📨 === RESPOSTA RECEBIDA ===');
    console.log('📊 Status:', res.status, res.statusText);
    console.log('🔗 URL final:', res.url);
    console.log('🔄 Redirecionado?', res.redirected);
    console.log('👌 OK?', res.ok);
    
    // Verificar se foi redirecionado (problema de autenticação)
    if (res.redirected) {
      console.error('⚠️  REDIRECIONAMENTO DETECTADO! URL:', res.url);
      console.error('⚠️  Provável problema de autenticação/token');
    }
    
    const responseText = await res.text();
    console.log('📄 Resposta (texto):', responseText);
    
    // Tentar parsear como JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
      console.log('📦 Resposta (JSON):', jsonResponse);
    } catch (e) {
      console.log('❌ Resposta não é JSON válido');
      jsonResponse = responseText;
    }
    
    if (!res.ok) {
      console.error('💥 ERRO NA RESPOSTA:', {
        status: res.status,
        statusText: res.statusText,
        body: jsonResponse
      });
      
      let errorMessage = 'Falha ao criar hospedagem';
      if (jsonResponse && jsonResponse.message) {
        errorMessage += ': ' + jsonResponse.message;
      } else if (typeof jsonResponse === 'string') {
        errorMessage += ': ' + jsonResponse.substring(0, 200);
      }
      
      throw new Error(errorMessage);
    }
    
    console.log('🎉 === SUCESSO ===');
    console.log('✅ Accommodation criada com sucesso!');
    
    return jsonResponse as Promise<ApiResponse<Accommodation>>;
    
  } catch (error) {
    console.error('💣 === ERRO NA REQUISIÇÃO ===');
    console.error('Erro:', error);
    
    if (error instanceof Error) {
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
    }
    
    throw error;
  } finally {
    console.log('🔚 === FIM DO PROCESSO CREATE ===\n\n');
  }
},

 update: async (id: string, data: Partial<Accommodation> & { image_file?: File }) => {
  const formData = new FormData();
  
  // Append _method=PUT para Laravel
  formData.append('_method', 'PUT');

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image_file' && value instanceof File) {
        formData.append('image_file', value);
      } else if (Array.isArray(value)) {
        formData.append(key, value.join(', '));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/admin/accommodations/${id}`, {
    method: 'POST', // Laravel interpreta _method=PUT
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Falha ao atualizar hospedagem');
  }

  return res.json() as Promise<ApiResponse<Accommodation>>;
},

  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/accommodations/${id}`, {
      method: 'DELETE',
    }),

  featured: () =>
    apiRequest<ApiResponse<Accommodation[]>>(
      '/accommodations?is_featured=true&per_page=8'
    ),
};

export const experiencesApi = {
  list: (params?: Record<string, any>) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );

    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/experiences${query ? `?${query}` : ''}`);
  },

  get: (slug: string) =>
    apiRequest<ApiResponse<Experience>>(`/experiences/${slug}`),

  create: async (data: Partial<Experience> & { image_file?: File }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image_file' && value instanceof File) {
          formData.append('image_file', value);
        } else if (Array.isArray(value)) {
          formData.append(key, value.join(', '));
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/admin/experiences`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Falha ao criar experiência');
    }

    return res.json() as Promise<ApiResponse<Experience>>;
  },

  update: async (id: string, data: Partial<Experience> & { image_file?: File }) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image_file' && value instanceof File) {
          formData.append('image_file', value);
        } else if (Array.isArray(value)) {
          formData.append(key, value.join(', '));
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/admin/experiences/${id}`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Falha ao atualizar experiência');
    }

    return res.json() as Promise<ApiResponse<Experience>>;
  },

  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/experiences/${id}`, {
      method: 'DELETE',
    }),
};

// Bookings API
export const bookingsApi = {
  // Usuário: Listar minhas reservas
  myBookings: (params?: Record<string, any>) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest<PaginatedResponse<Booking>>(`/bookings${query ? `?${query}` : ''}`);
  },

  // Usuário: Detalhes da reserva
  getBooking: (id: string) =>
    apiRequest<ApiResponse<Booking>>(`/bookings/${id}`),

  // Usuário: Criar reserva
  createBooking: async (data: {
    accommodation_id?: string;
    experience_id?: string;
    check_in?: string;
    check_out?: string;
    booking_date?: string;
    booking_time?: string;
    guests: number;
    special_requests?: string;
  }) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Falha ao criar reserva');
    }

    return res.json() as Promise<ApiResponse<Booking>>;
  },

  // Usuário: Cancelar reserva
  cancelBooking: (id: string) =>
    apiRequest<ApiResponse<Booking>>(`/bookings/${id}/cancel`, {
      method: 'PUT',
    }),

  // Usuário: Verificar disponibilidade
  checkAvailability: async (data: {
  accommodation_id?: string;
  experience_id?: string;
  check_in?: string;
  check_out?: string;
  booking_date?: string;
  guests?: number;
}) => {
  return apiRequest<ApiResponse<{ available: boolean; message?: string }>>(
    '/bookings/check-availability',
    {
      method: 'POST', // Mude para POST
      body: JSON.stringify(data), // Envie como JSON
    }
  );
},

  // Admin: Todas as reservas
  listAll: (params?: Record<string, any>) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest<PaginatedResponse<Booking>>(`/admin/bookings${query ? `?${query}` : ''}`);
  },

  // Admin: Atualizar status
  updateStatus: async (id: string, status: Booking['status']) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('status', status);

    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}/status`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Falha ao atualizar status da reserva');
    }

    return res.json() as Promise<ApiResponse<Booking>>;
  },
};

// Users API (Admin)
export const usersApi = {
  list: (params?: Record<string, any>) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest<PaginatedResponse<User & { bookings_count?: number }>>(
      `/admin/users${query ? `?${query}` : ''}`
    );
  },

  updateRole: async (id: string, role: User['role']) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('role', role);

    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Falha ao atualizar role do usuário');
    }

    return res.json() as Promise<ApiResponse<User>>;
  },

  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
};


// Dashboard API (Admin)
export const dashboardApi = {
  stats: () => apiRequest<ApiResponse<DashboardStats>>('/admin/stats'),
};


 //=====================
// Upload de imagem
// =====================
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // 'Content-Type' NÃO colocar! O browser define multipart/form-data sozinho
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Erro no upload', text);
    throw new Error('Falha no upload de imagem');
  }

  const data: UploadResponse = await res.json();
  console.log('Resposta upload:', data);

  return data;
}