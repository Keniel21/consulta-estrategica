import { supabase } from '../supabase';

const API_BASE = '/api';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro na requisição');
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  getProfile: () => fetchAPI('/profile'),
  getCooperatives: () => fetchAPI('/cooperatives'),
  getInsurers: () => fetchAPI('/insurers'),
  getProducts: () => fetchAPI('/products'),
  searchCooperative: (q: string) => fetchAPI(`/search-cooperative?q=${encodeURIComponent(q)}`),
  
  // Admin methods
  saveCooperative: (data: any) => fetchAPI('/cooperatives', {
    method: data.id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  deleteCooperative: (id: string) => fetchAPI(`/cooperatives?id=${id}`, {
    method: 'DELETE',
  }),
  saveProduct: (data: any) => fetchAPI('/products', {
    method: data.id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id: string) => fetchAPI(`/products?id=${id}`, {
    method: 'DELETE',
  }),
  saveInsurer: (data: any) => fetchAPI('/insurers', {
    method: data.id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  deleteInsurer: (id: string) => fetchAPI(`/insurers?id=${id}`, {
    method: 'DELETE',
  }),
};
