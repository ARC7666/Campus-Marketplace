import { supabase } from '../lib/supabaseClient';

export { supabase };

export const activityLogRef = () => Firebase.firestore().collection('activity_logs');
export const notificationsRef = () => Firebase.firestore().collection('notifications');
export const searchesRef = () => Firebase.firestore().collection('searches');
export const reportsRef = () => Firebase.firestore().collection('reports');
export const increment = (n) => n;
export const arrayUnion = (item) => (list = []) => [...list, item];
export const arrayRemove = (item) => (list = []) => list.filter(i => i !== item);

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

export const getConversationRef = (id) => Firebase.firestore().collection('conversations').doc(id);
export const getMessagesRef = (id) => Firebase.firestore().collection('messages').where('conversation_id', '==', id);
export const getMessageRef = (id) => Firebase.firestore().collection('messages').doc(id);

export const productsRef = () => Firebase.firestore().collection('products');
export const reviewsRef = () => Firebase.firestore().collection('reviews');
export const followersRef = () => Firebase.firestore().collection('followers');
export const followingRef = () => Firebase.firestore().collection('following');
export const conversationsRef = () => Firebase.firestore().collection('conversations');
export const messagesRef = () => Firebase.firestore().collection('messages');
export const offersRef = () => Firebase.firestore().collection('offers');
export const verificationRequestsRef = () => Firebase.firestore().collection('verification_requests');
export const blockedUsersRef = () => Firebase.firestore().collection('blocked_users');
export const categoriesRef = () => Firebase.firestore().collection('categories');
export const bannersRef = () => Firebase.firestore().collection('banners');
export const transactionsRef = () => ({ add: () => Promise.resolve() });
export const userAddressesRef = () => ({ add: () => Promise.resolve() });
export const addressesRef = () => ({ add: () => Promise.resolve() });
export const wishlistRef = () => ({ add: () => Promise.resolve() });
export const adViewsRef = () => ({ add: () => Promise.resolve() });
export const savedSearchesRef = () => ({ add: () => Promise.resolve() });
export const usersRef = () => ({ add: () => Promise.resolve() });
export const adsRef = () => ({ add: () => Promise.resolve() });
export const userPreferencesRef = () => ({ add: () => Promise.resolve() });
export const verificationsRef = () => ({ add: () => Promise.resolve() });
export const createNotification = () => Promise.resolve();
export const updateUserDoc = () => Promise.resolve();
export const createReviewDoc = () => Promise.resolve();
export const createFollowerDoc = () => Promise.resolve();
export const serverTimestamp = () => new Date().toISOString();
export const timestamp = () => new Date().toISOString();
export const Timestamp = { now: () => new Date(), fromDate: (d) => d };
export const FieldValue = { serverTimestamp: () => new Date().toISOString(), arrayUnion: (v) => v, arrayRemove: (v) => v, increment: (n) => n };
export const createOffer = () => Promise.resolve();
export const updateAdStats = () => Promise.resolve();
export const recordPriceHistory = () => Promise.resolve();

export const createChatConversation = async (productId, sellerId, buyerId) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ product_id: productId, participants: [sellerId, buyerId], seller_id: sellerId, buyer_id: buyerId }])
    .select()
    .single();
  if (error) throw error;
  return data.id;
};
export const createChatMessage = async (conversationId, senderId, content) => {
  const { error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, sender_id: senderId, content }]);
  if (error) throw error;
};
export const getConversationsForUser = (userId) => {
  return Firebase.firestore()
    .collection('conversations')
    .where('participants', 'array-contains', userId);
};

export const createReportDoc = () => Promise.resolve();
export const createVerificationRequest = () => Promise.resolve();
export const updateProfileData = () => Promise.resolve();
export const getOrCreateConversation = () => Promise.resolve('mock-id');
export const logAdView = () => {};
export const deleteAd = () => Promise.resolve();
export const markAsSold = () => Promise.resolve();
export const requestFeatured = () => Promise.resolve();
export const logSignUp = () => {};
export const logLogin = () => {};
export const ensureUserDoc = () => Promise.resolve();
export const sendEmailVerification = () => Promise.resolve();
export const isPremiumUser = () => false;
export const migrateProductDoc = (doc) => doc.data ? doc.data() : doc;

export const getMessagesForConversation = () => Promise.resolve([]);
export const getSellerOffers = () => Promise.resolve([]);
export const getBuyerOffers = () => Promise.resolve([]);
export const getFollowers = () => Promise.resolve([]);
export const getFollowing = () => Promise.resolve([]);
export const getFollowersForUser = () => Promise.resolve([]);
export const getFollowingForUser = () => Promise.resolve([]);
export const isFollowing = () => Promise.resolve(false);
export const followUser = () => Promise.resolve();
export const unfollowUser = () => Promise.resolve();
export const toggleFollow = () => Promise.resolve();
export const getReviewsForUser = () => Promise.resolve([]);
export const getNearbyProducts = () => Promise.resolve([]);
export const searchProducts = () => Promise.resolve([]);
export const getSimilarProducts = () => Promise.resolve([]);
export const getProductById = (id) => supabase.from('products').select('*').eq('id', id).single().then(r => r.data);
export const getUserById = (id) => supabase.from('profiles').select('*').eq('id', id).single().then(r => r.data);
export const getPriceHistory = () => Promise.resolve([]);
export const getAdStats = () => Promise.resolve({});
export const getFeaturedAds = () => Promise.resolve([]);
export const getPromotedAds = () => Promise.resolve([]);
export const getBanners = () => Promise.resolve([]);
export const getCategories = () => Promise.resolve([]);
export const logSearch = () => {};
export const deleteUserAccount = () => Promise.resolve();
export const getProductsQuery = () => ({ get: () => Promise.resolve({ docs: [] }) });
export const getSavedAds = () => Promise.resolve([]);
export const favoriteAd = () => Promise.resolve();
export const WatchlistRef = () => ({ add: () => Promise.resolve() });

export const Firebase = {
  auth: Object.assign(() => supabase.auth, {
    GoogleAuthProvider: class { constructor() { this.providerId = 'google.com'; } },
    EmailAuthProvider: class { constructor() { this.providerId = 'password'; } },
  }),
  storage: () => ({
    ref: (path) => ({
      put: (file) => supabase.storage.from('images').upload(path.replace(/^\//, ''), file),
      getDownloadURL: () => Promise.resolve('https://placeholder.com/url'), // Mock for now
    })
  }),
  firestore: Object.assign(() => ({
    collection: (name) => ({
      doc: (id) => ({
        get: () => supabase.from(name).select('*').eq('id', id).single().then(({ data }) => {
          const mapped = data ? { ...data } : null;
          if (mapped && mapped.created_at) mapped.createdAt = { toDate: () => new Date(mapped.created_at) };
          return { exists: !!data, data: () => mapped, id };
        }),
        update: (updates) => supabase.from(name).update(updates).eq('id', id),
        onSnapshot: (callback) => {
           const interval = setInterval(async () => {
             const { data } = await supabase.from(name).select('*').eq('id', id).single();
             if (data) {
               const mapped = { ...data };
               if (mapped.created_at) mapped.createdAt = { toDate: () => new Date(mapped.created_at) };
               callback({ exists: true, data: () => mapped, id });
             }
           }, 5000);
           return () => clearInterval(interval);
        }
      }),
      where: (f, op, val) => {
        const query = {
          where: (f2, op2, val2) => query,
          orderBy: (p, dir) => {
            const prop = p === 'timestamp' ? 'created_at' : (p === 'createdAt' ? 'created_at' : p);
            const buildSnap = (limitN = null) => (callback) => {
              const interval = setInterval(async () => {
                let s = supabase.from(name).select('*');
                if (op === 'array-contains') s = s.contains(f, [val]);
                else s = s.eq(f, val);
                s = s.order(prop, { ascending: dir !== 'desc' });
                if (limitN) s = s.limit(limitN);
                
                const { data } = await s;
                const docs = (data || []).map(d => {
                  const mapped = { ...d };
                  if (d.created_at) mapped.createdAt = { toDate: () => new Date(d.created_at) };
                  if (d.created_at) mapped.timestamp = { toDate: () => new Date(d.created_at) };
                  if (d.sender_id) mapped.senderId = d.sender_id;
                  return { data: () => mapped, id: d.id };
                });
                callback({ docs });
              }, 5000);
              return () => clearInterval(interval);
            };
            return {
              onSnapshot: buildSnap(),
              limit: (n) => ({
                onSnapshot: buildSnap(n),
                get: () => {
                  let s = supabase.from(name).select('*');
                  if (op === 'array-contains') s = s.contains(f, [val]);
                  else s = s.eq(f, val);
                  return s.order(prop, { ascending: dir !== 'desc' }).limit(n).then(({ data }) => {
                    const docs = (data || []).map(d => {
                      const mapped = { ...d };
                      if (d.created_at) mapped.createdAt = { toDate: () => new Date(d.created_at) };
                      if (d.created_at) mapped.timestamp = { toDate: () => new Date(d.created_at) };
                      if (d.sender_id) mapped.senderId = d.sender_id;
                      return { data: () => mapped, id: d.id };
                    });
                    return { docs };
                  });
                }
              }),
              get: () => {
                let s = supabase.from(name).select('*');
                if (op === 'array-contains') s = s.contains(f, [val]);
                else s = s.eq(f, val);
                return s.order(prop, { ascending: dir !== 'desc' }).then(({ data }) => {
                  const docs = (data || []).map(d => {
                    const mapped = { ...d };
                    if (d.created_at) mapped.createdAt = { toDate: () => new Date(d.created_at) };
                    if (d.created_at) mapped.timestamp = { toDate: () => new Date(d.created_at) };
                    if (d.sender_id) mapped.senderId = d.sender_id;
                    return { data: () => mapped, id: d.id };
                  });
                  return { docs };
                });
              }
            };
          },
          get: () => {
            let s = supabase.from(name).select('*');
            if (op === 'array-contains') s = s.contains(f, [val]);
            else s = s.eq(f, val);
            return s.then(({ data }) => {
              const docs = (data || []).map(d => {
                const mapped = { ...d };
                if (d.created_at) mapped.createdAt = { toDate: () => new Date(d.created_at) };
                if (d.created_at) mapped.timestamp = { toDate: () => new Date(d.created_at) };
                if (d.sender_id) mapped.senderId = d.sender_id;
                return { data: () => mapped, id: d.id };
              });
              return { docs };
            });
          },
          add: (data) => {
            const mapped = { ...data };
            if (f === 'conversation_id') mapped.conversation_id = val;
            if (mapped.senderId) { mapped.sender_id = mapped.senderId; delete mapped.senderId; }
            if (mapped.text) { mapped.content = mapped.text; delete mapped.text; }
            if (mapped.timestamp) delete mapped.timestamp;
            return supabase.from(name).insert([mapped]);
          }
        };
        return query;
      },
      add: (data) => supabase.from(name).insert([data]),
    })
  }), { 
    FieldValue,
    batch: () => ({
      update: () => {},
      commit: () => Promise.resolve()
    })
  }),
  notificationsRef,
  activityLogRef,
  searchesRef,
  reportsRef,
};
