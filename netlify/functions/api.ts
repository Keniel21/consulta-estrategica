import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const handler = async (event: any) => {
  const { path, httpMethod, headers, body } = event;
  const route = path.replace('/.netlify/functions/api', '').replace('/api', '');

  // Auth check
  const authHeader = headers.authorization || headers.Authorization;
  const token = authHeader?.replace('Bearer ', '');
  let user: any = null;
  if (token) {
    const { data } = await supabaseAdmin.auth.getUser(token);
    user = data.user;
  }

  const isAdmin = async (userId: string) => {
    const { data } = await supabaseAdmin.from('profiles').select('role').eq('id', userId).single();
    return data?.role === 'admin';
  };

  try {
    // --- READ ROUTES ---
    if (httpMethod === 'GET') {
      if (route === '/profile') {
        if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Auth required' }) };
        const { data, error } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify(data) };
      }
      if (route === '/cooperatives') {
        const { data, error } = await supabaseAdmin.from('cooperatives').select('*').order('code');
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify(data) };
      }
      if (route === '/insurers') {
        const { data, error } = await supabaseAdmin.from('insurers').select('*').order('name');
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify(data) };
      }
      if (route === '/products') {
        // Busca unificada de sinistros e renovações com discriminador de tipo
        const { data: p1, error: e1 } = await supabaseAdmin.from('products').select('*, cooperative:cooperatives(name, code, location)');
        const { data: p2, error: e2 } = await supabaseAdmin.from('renewal_products').select('*, cooperative:cooperatives(name, code, location)');
        if (e1 || e2) throw e1 || e2;

        const results = [
          ...(p1 || []).map(p => ({ ...p, type: 'sinistro' })),
          ...(p2 || []).map(p => ({ ...p, type: 'renovacao' }))
        ];

        return { statusCode: 200, body: JSON.stringify(results) };
      }
      if (route === '/search-cooperative') {
        const q = event.queryStringParameters.q;
        const { data, error } = await supabaseAdmin.from('cooperatives').select('*').or(`code.ilike.%${q}%,name.ilike.%${q}%`).limit(1).maybeSingle();
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify(data) };
      }
    }

    // --- WRITE ROUTES (ADMIN ONLY) ---
    if (['POST', 'PUT', 'DELETE'].includes(httpMethod)) {
      if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Auth required' }) };
      const admin = await isAdmin(user.id);
      if (!admin) return { statusCode: 403, body: JSON.stringify({ error: 'Admin role required' }) };

      const payload = body ? JSON.parse(body) : {};
      const id = event.queryStringParameters?.id || payload.id;

      // Routing for Write Operations
      if (route === '/cooperatives') {
        if (httpMethod === 'DELETE') {
           const { error } = await supabaseAdmin.from('cooperatives').delete().eq('id', id);
           if (error) throw error; return { statusCode: 204 };
        }
        const { data, error } = await supabaseAdmin.from('cooperatives').upsert(payload).select().single();
        if (error) throw error; return { statusCode: 200, body: JSON.stringify(data) };
      }

      if (route === '/products') {
        // Identifica a tabela com base no campo 'type' enviado pelo frontend
        const table = payload.type === 'renovacao' ? 'renewal_products' : 'products';
        delete payload.type; // remove flag de controle
        if (httpMethod === 'DELETE') {
           // Como deletar sem saber a tabela? O ID deve ser único ou passamos o tipo via query
           const type = event.queryStringParameters?.type;
           const targetTable = type === 'renovacao' ? 'renewal_products' : 'products';
           const { error } = await supabaseAdmin.from(targetTable).delete().eq('id', id);
           if (error) throw error; return { statusCode: 204 };
        }
        const { data, error } = await supabaseAdmin.from(table).upsert(payload).select().single();
        if (error) throw error; return { statusCode: 200, body: JSON.stringify(data) };
      }

      if (route === '/insurers') {
        if (httpMethod === 'DELETE') {
           const { error } = await supabaseAdmin.from('insurers').delete().eq('id', id);
           if (error) throw error; return { statusCode: 204 };
        }
        const { data, error } = await supabaseAdmin.from('insurers').upsert(payload).select().single();
        if (error) throw error; return { statusCode: 200, body: JSON.stringify(data) };
      }
    }

    return { statusCode: 404, body: JSON.stringify({ error: 'Route not found' }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
