import { supabase } from '../../lib/supabaseClient';

export const getProductRef = (id) => ({
  get: () => supabase.from('products').select('*').eq('id', id).single().then(({ data }) => ({ exists: !!data, data: () => data, id: data?.id })),
  update: (updates) => supabase.from('products').update(updates).eq('id', id),
});

export const getUserRef = (id) => ({
  get: () => supabase.from('profiles').select('*').eq('id', id).single().then(({ data }) => ({ exists: !!data, data: () => data, id: data?.id })),
  update: (updates) => supabase.from('profiles').update(updates).eq('id', id),
  onSnapshot: (callback) => {
    let interval = setInterval(async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (data) callback({ exists: true, data: () => data });
    }, 5000);
    return () => clearInterval(interval);
  }
});

export const increment = (n) => n;
export const arrayUnion = (item) => (list = []) => [...list, item];
export const arrayRemove = (item) => (list = []) => list.filter(i => i !== item);

export const getOrCreateConversation = () => Promise.resolve('mock-conv-id');
export const productsRef = () => ({ add: (d) => supabase.from('products').insert([d]) });
export const isPremiumUser = () => false;
export const migrateProductDoc = (doc) => doc.data();
export const activityLogRef = () => ({ add: () => Promise.resolve() });
export const notificationsRef = () => ({ add: () => Promise.resolve() });
export const searchesRef = () => ({ add: () => Promise.resolve() });
export const reportsRef = () => ({ add: () => Promise.resolve() });
export const logSignUp = () => {};
export const logLogin = () => {};
export const ensureUserDoc = () => Promise.resolve();
export const sendEmailVerification = () => Promise.resolve();
