import { supabase } from './supabaseClient';

// Helper to provide a familiar interface while migrating
export const getProductRef = (id) => ({
  get: () => supabase.from('products').select('*').eq('id', id).single().then(({ data }) => ({ exists: !!data, data: () => data, id: data?.id })),
  update: (updates) => supabase.from('products').update(updates).eq('id', id),
});

export const getUserRef = (id) => ({
  get: () => supabase.from('profiles').select('*').eq('id', id).single().then(({ data }) => ({ exists: !!data, data: () => data, id: data?.id })),
  update: (updates) => supabase.from('profiles').update(updates).eq('id', id),
  onSnapshot: (callback) => {
    // Basic polling or mock for real-time
    const interval = setInterval(async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (data) callback({ exists: true, data: () => data });
    }, 5000);
    return () => clearInterval(interval);
  }
});

export const increment = (n) => n; // Placeholder
export const arrayUnion = (item) => (list = []) => [...list, item];
export const arrayRemove = (item) => (list = []) => list.filter(i => i !== item);

export const Firebase = {
  firestore: () => ({
    collection: (name) => ({
      doc: (id) => ({ get: () => Promise.resolve({ exists: false }) }),
      where: () => ({ orderBy: () => ({ get: () => Promise.resolve({ docs: [] }) }) }),
    })
  }),
  auth: () => supabase.auth,
  storage: () => supabase.storage,
};
