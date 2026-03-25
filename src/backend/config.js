import { supabase } from '../lib/supabaseClient';

export { supabase };

export const activityLogRef = () =>
  Database.firestore().collection('activity_logs');
export const notificationsRef = () =>
  Database.firestore().collection('notifications');
export const searchesRef = () => Database.firestore().collection('searches');
export const reportsRef = () => Database.firestore().collection('reports');
export const increment = (n) => n;
export const arrayUnion =
  (item) =>
  (list = []) => [...list, item];
export const arrayRemove =
  (item) =>
  (list = []) =>
    list.filter((i) => i !== item);

export const getProductRef = (id) => ({
  get: () =>
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => ({ exists: !!data, data: () => data, id: data?.id })),
  update: (updates) => supabase.from('products').update(updates).eq('id', id),
});

export const getUserRef = (id) => ({
  get: () =>
    supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => ({ exists: !!data, data: () => data, id: data?.id })),
  update: (updates) => supabase.from('profiles').update(updates).eq('id', id),
  onSnapshot: (callback) => {
    const run = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (data) callback({ exists: true, data: () => data, id });
    };
    run();
    let interval = setInterval(run, 5000);
    return () => clearInterval(interval);
  },
});

export const getConversationRef = (id) =>
  Database.firestore().collection('conversations').doc(id);
export const getMessagesRef = (id) =>
  Database.firestore()
    .collection('messages')
    .where('conversation_id', '==', id);
export const getMessageRef = (id) =>
  Database.firestore().collection('messages').doc(id);

export const productsRef = () => Database.firestore().collection('products');
export const reviewsRef = () => Database.firestore().collection('reviews');
export const followersRef = () => Database.firestore().collection('followers');
export const followingRef = () => Database.firestore().collection('following');
export const conversationsRef = () =>
  Database.firestore().collection('conversations');
export const messagesRef = () => Database.firestore().collection('messages');
export const offersRef = () => Database.firestore().collection('offers');
export const verificationRequestsRef = () =>
  Database.firestore().collection('verification_requests');
export const blockedUsersRef = () =>
  Database.firestore().collection('blocked_users');
export const categoriesRef = () =>
  Database.firestore().collection('categories');
export const bannersRef = () => Database.firestore().collection('banners');
export const adPromotionsRef = () =>
  Database.firestore().collection('ad_promotions');
export const transactionsRef = () => ({ add: () => Promise.resolve() });
export const userAddressesRef = () => ({ add: () => Promise.resolve() });
export const addressesRef = () => ({ add: () => Promise.resolve() });
export const wishlistRef = () => ({ add: () => Promise.resolve() });
export const adViewsRef = () => ({ add: () => Promise.resolve() });
export const savedSearchesRef = () => ({ add: () => Promise.resolve() });
export const usersRef = () => ({ add: () => Promise.resolve() });
export const adsRef = () => ({ add: () => Promise.resolve() });
export const userPreferencesRef = () => Database.firestore().collection('user_preferences');
export const verificationsRef = () => ({ add: () => Promise.resolve() });
export const createNotification = async (notificationData) => {
  const { error } = await supabase.from('notifications').insert([notificationData]);
  if (error) console.error('Failed to create notification', error);
  return { error };
};
export const updateUserDoc = () => Promise.resolve();
export const createReviewDoc = () => Promise.resolve();
export const createFollowerDoc = () => Promise.resolve();
export const serverTimestamp = () => new Date().toISOString();
export const timestamp = () => new Date().toISOString();
export const Timestamp = { now: () => new Date(), fromDate: (d) => d };
export const FieldValue = {
  serverTimestamp: () => new Date().toISOString(),
  arrayUnion: (v) => v,
  arrayRemove: (v) => v,
  increment: (n) => n,
};
export const createOffer = async (offerData) => {
  // 1. Insert offer
  const { data: offer, error } = await supabase
    .from('offers')
    .insert([{
      product_id: offerData.productId,
      product_name: offerData.productName,
      product_image: offerData.productImage,
      seller_id: offerData.sellerId,
      buyer_id: offerData.buyerId,
      amount: offerData.offerAmount,
      original_price: offerData.originalPrice,
      message: offerData.message,
      payment_method: offerData.paymentMethod,
      delivery_preference: offerData.deliveryPreference,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;

  // 2. Insert notification for seller — link to the Received tab
  await createNotification({
    user_id: offerData.sellerId,
    type: 'offer_received',
    title: 'New Offer Received',
    body: `You received a new offer of ₹${offerData.offerAmount} for ${offerData.productName}`,
    image_url: offerData.productImage,
    action_url: `/dashboard/offers/received`,
    data: { offerId: offer.id, productId: offerData.productId },
    priority: 'high'
  });

  // 3. Automatically create or locate a chat conversation to link them
  let convId = null;
  const { data: existingConv } = await supabase
    .from('conversations')
    .select('id')
    .eq('product_id', offerData.productId)
    .contains('participants', [offerData.buyerId, offerData.sellerId])
    .maybeSingle();

  if (existingConv) {
    convId = existingConv.id;
  } else {
    const { data: newConv } = await supabase
      .from('conversations')
      .insert([{
        product_id: offerData.productId,
        buyer_id: offerData.buyerId,
        seller_id: offerData.sellerId,
        participants: [offerData.buyerId, offerData.sellerId],
        last_message: `Offer sent: ₹${offerData.offerAmount}`,
      }])
      .select()
      .single();
    if (newConv) convId = newConv.id;
  }

  // 4. Send an actual message into the chat room indicating the offer
  if (convId) {
    await supabase.from('messages').insert([{
      conversation_id: convId,
      sender_id: offerData.buyerId,
      content: `I've sent an offer for ₹${offerData.offerAmount}! ${offerData.message || ''}`,
    }]);
  }

  return offer;
};
export const updateAdStats = () => Promise.resolve();
export const recordPriceHistory = () => Promise.resolve();

export const createChatConversation = async (productId, sellerId, buyerId) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        product_id: productId,
        participants: [sellerId, buyerId],
        seller_id: sellerId,
        buyer_id: buyerId,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data.id;
};
export const createChatMessage = async (conversationId, senderId, content) => {
  const { error } = await supabase
    .from('messages')
    .insert([
      { conversation_id: conversationId, sender_id: senderId, content },
    ]);
  if (error) throw error;
};
export const getConversationsForUser = (userId) => {
  return Database.firestore()
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
export const migrateProductDoc = (doc) => (doc.data ? doc.data() : doc);

export const getMessagesForConversation = () => Promise.resolve([]);

export const getSellerOffers = async (sellerId) => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getBuyerOffers = async (buyerId) => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};
export const getFollowers = () => Promise.resolve([]);
export const getFollowing = () => Promise.resolve([]);
export const getFollowersForUser = () => Promise.resolve([]);
export const getFollowingForUser = () => Promise.resolve([]);
export const isFollowing = () => Promise.resolve(false);
export const followUser = () => Promise.resolve();
export const unfollowUser = () => Promise.resolve();
export const deleteCurrentUser = () => Promise.resolve();
export const getEmailCredential = (email, password) => ({ email, password });
export const reauthenticateWithCredential = (user, credential) =>
  Promise.resolve();
export const getGoogleProvider = () => ({});
export const getAddressesForUser = (userId) =>
  Database.firestore().collection('addresses').where('user_id', '==', userId);
export const toggleFollow = (userId) => Promise.resolve();
export const getRemoteNumber = (key) => Promise.resolve(0);
export const getTransactionsForBuyer = (userId) => Promise.resolve([]);
export const getTransactionsForSeller = (userId) => Promise.resolve([]);
export const signInWithPhoneNumber = (phoneNumber) => Promise.resolve();
export const notifyPriceDrop = (productId, sellerId) => Promise.resolve();
export const updateOfferStatus = async (offerId, status, amount) => {
  const updates = { status };
  if (status === 'countered' && amount) {
    updates.counter_amount = amount;
  }

  const { data: offer, error } = await supabase
    .from('offers')
    .update(updates)
    .eq('id', offerId)
    .select()
    .single();

  if (error) throw error;

  // Insert into transactions table if the offer was accepted
  if (status === 'accepted') {
    const { error: txError } = await supabase.from('transactions').insert([{
      product_id: offer.product_id,
      seller_id: offer.seller_id,
      buyer_id: offer.buyer_id,
      offer_id: offer.id,
      amount: offer.amount,
      status: 'completed'
    }]);
    if (txError) console.error('Failed to record transaction:', txError);
    
    // Also mark the product as sold
    await supabase.from('products').update({ status: 'sold', sold_at: new Date().toISOString() }).eq('id', offer.product_id);
  }

  // Notify buyer about the status change
  let title = 'Offer Updated';
  let body = `Your offer for ${offer.product_name} was updated.`;
  if (status === 'accepted') {
    title = 'Offer Accepted!';
    body = `Your offer of ₹${offer.amount} for ${offer.product_name} was accepted!`;
  } else if (status === 'rejected') {
    title = 'Offer Declined';
    body = `Your offer for ${offer.product_name} was declined.`;
  } else if (status === 'countered') {
    title = 'New Counter Offer';
    body = `The seller countered with ₹${amount} for ${offer.product_name}.`;
  }

  await createNotification({
    user_id: offer.buyer_id, // notify the buyer — link to Sent tab
    type: `offer_${status}`,
    title,
    body,
    image_url: offer.product_image,
    action_url: `/dashboard/offers`,
    data: { offerId: offer.id, productId: offer.product_id },
    priority: status === 'accepted' ? 'high' : 'normal'
  });

  // Update conversation last_message
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('product_id', offer.product_id)
    .contains('participants', [offer.buyer_id, offer.seller_id])
    .maybeSingle();

  if (conv) {
    const msg = status === 'countered' 
      ? `I've countered your offer with ₹${amount}` 
      : (status === 'accepted' ? `I have accepted your offer!` : `I have declined your offer.`);
    
    await supabase.from('messages').insert([{
      conversation_id: conv.id,
      sender_id: offer.seller_id,
      content: msg,
    }]);

    await supabase.from('conversations').update({ last_message: msg }).eq('id', conv.id);
  }

  return offer;
};
export const migrateUserDoc = (doc) => (doc.data ? doc.data() : doc);
export const getReviewsForUser = () => Promise.resolve([]);
export const getNearbyProducts = () => Promise.resolve([]);
export const searchProducts = () => Promise.resolve([]);
export const getSimilarProducts = () => Promise.resolve([]);
export const getProductById = (id) =>
  supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
    .then((r) => r.data);
export const getUserById = (id) =>
  supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
    .then((r) => r.data);
export const getPriceHistory = () => Promise.resolve([]);
export const getAdStats = () => Promise.resolve({});
export const getFeaturedAds = () => Promise.resolve([]);
export const getPromotedAds = () => Promise.resolve([]);
export const getBanners = () => Promise.resolve([]);
export const getCategories = () => Promise.resolve([]);
export const logSearch = () => {};
export const deleteUserAccount = () => Promise.resolve();
export const getProductsQuery = () => ({
  get: () => Promise.resolve({ docs: [] }),
});
export const getSavedAds = () => Promise.resolve([]);
export const favoriteAd = () => Promise.resolve();
export const WatchlistRef = () => ({ add: () => Promise.resolve() });

export const Database = {
  auth: Object.assign(() => supabase.auth, {
    GoogleAuthProvider: class {
      constructor() {
        this.providerId = 'google.com';
      }
    },
    EmailAuthProvider: class {
      constructor() {
        this.providerId = 'password';
      }
    },
  }),
  storage: () => ({
    ref: (path) => ({
      put: (file) =>
        supabase.storage.from('images').upload(path.replace(/^\//, ''), file),
      getDownloadURL: () => Promise.resolve('https://placeholder.com/url'), // Mock for now
    }),
  }),
  firestore: Object.assign(
    () => {
      const mapIncoming = (d) => {
        if (!d) return d;
        const mapped = { ...d };
        if (d.created_at) {
          const date = new Date(d.created_at);
          mapped.createdAt = { toDate: () => date };
          mapped.timestamp = { toDate: () => date };
        }
        if (d.sender_id) mapped.senderId = d.sender_id;
        if (d.content) mapped.text = d.content;
        if (d.last_message) mapped.lastMessage = d.last_message;
        if (d.last_message_at) mapped.lastMessageAt = d.last_message_at;
        if (d.full_name) mapped.name = d.full_name;
        if (d.display_name && !mapped.name) mapped.name = d.display_name;
        if (d.avatar_url && !mapped.avatar) mapped.avatar = d.avatar_url;
        return mapped;
      };

      const mapOutgoing = (data) => {
        const mapped = { ...data };
        if (mapped.senderId) {
          mapped.sender_id = mapped.senderId;
          delete mapped.senderId;
        }
        if (mapped.text) {
          mapped.content = mapped.text;
          delete mapped.text;
        }
        if (mapped.lastMessage) {
          mapped.last_message = mapped.lastMessage;
          delete mapped.lastMessage;
        }
        if (mapped.lastMessageAt) {
          mapped.last_message_at = mapped.lastMessageAt;
          delete mapped.lastMessageAt;
        }
        if (mapped.timestamp) delete mapped.timestamp;
        if (mapped.createdAt) delete mapped.createdAt;
        return mapped;
      };

      return {
        collection: (name) => ({
          doc: (id) => ({
            get: () =>
              supabase
                .from(name)
                .select('*')
                .eq('id', id)
                .single()
                .then(({ data }) => ({
                  exists: !!data,
                  data: () => mapIncoming(data),
                  id,
                })),
            update: (updates) =>
              supabase.from(name).update(mapOutgoing(updates)).eq('id', id),
            onSnapshot: (callback) => {
              const run = async () => {
                const { data } = await supabase
                  .from(name)
                  .select('*')
                  .eq('id', id)
                  .single();
                if (data) {
                  callback({
                    exists: true,
                    data: () => mapIncoming(data),
                    id,
                  });
                }
              };
              run();
              const interval = setInterval(run, 5000);
              return () => clearInterval(interval);
            },
          }),
          where: (f, op, val) => {
            const query = {
              where: (f2, op2, val2) => query,
              orderBy: (p, dir) => {
                const prop = p === 'timestamp' || p === 'createdAt' ? 'created_at' : p;
                const buildSnap = (limitN = null) => (callback) => {
                  const run = async () => {
                    let s = supabase.from(name).select('*');
                    if (op === 'array-contains') s = s.contains(f, [val]);
                    else s = s.eq(f, val);
                    s = s.order(prop, { ascending: dir !== 'desc' });
                    if (limitN) s = s.limit(limitN);
                    const { data } = await s;
                    const docs = (data || []).map((d) => ({
                      data: () => mapIncoming(d),
                      id: d.id,
                    }));
                    callback({ docs, empty: (data || []).length === 0 });
                  };
                  run();
                  const interval = setInterval(run, 5000);
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
                      return s
                        .order(prop, { ascending: dir !== 'desc' })
                        .limit(n)
                        .then(({ data }) => ({
                          docs: (data || []).map((d) => ({
                            data: () => mapIncoming(d),
                            id: d.id,
                          })),
                          empty: (data || []).length === 0,
                        }));
                    },
                  }),
                  get: () => {
                    let s = supabase.from(name).select('*');
                    if (op === 'array-contains') s = s.contains(f, [val]);
                    else s = s.eq(f, val);
                    return s
                      .order(prop, { ascending: dir !== 'desc' })
                      .then(({ data }) => ({
                        docs: (data || []).map((d) => ({
                          data: () => mapIncoming(d),
                          id: d.id,
                        })),
                        empty: (data || []).length === 0,
                      }));
                  },
                };
              },
              limit: (n) => ({
              onSnapshot: (callback) => {
                const run = async () => {
                  let s = supabase.from(name).select('*');
                  if (op === 'array-contains') s = s.contains(f, [val]);
                  else s = s.eq(f, val);
                  s = s.limit(n);
                  const { data } = await s;
                  callback({
                    docs: (data || []).map((d) => ({
                      data: () => mapIncoming(d),
                      id: d.id,
                    })),
                    empty: (data || []).length === 0,
                  });
                };
                run();
                const interval = setInterval(run, 5000);
                return () => clearInterval(interval);
              },
                get: () => {
                  let s = supabase.from(name).select('*');
                  if (op === 'array-contains') s = s.contains(f, [val]);
                  else s = s.eq(f, val);
                  return s.limit(n).then(({ data }) => ({
                    docs: (data || []).map((d) => ({
                      data: () => mapIncoming(d),
                      id: d.id,
                    })),
                    empty: (data || []).length === 0,
                  }));
                },
              }),
              onSnapshot: (callback) => {
                const run = async () => {
                  let s = supabase.from(name).select('*');
                  if (op === 'array-contains') s = s.contains(f, [val]);
                  else s = s.eq(f, val);
                  const { data } = await s;
                  callback({
                    docs: (data || []).map((d) => ({
                      data: () => mapIncoming(d),
                      id: d.id,
                    })),
                    empty: (data || []).length === 0,
                  });
                };
                run();
                const interval = setInterval(run, 5000);
                return () => clearInterval(interval);
              },
              get: () => {
                let s = supabase.from(name).select('*');
                if (op === 'array-contains') s = s.contains(f, [val]);
                else s = s.eq(f, val);
                return s.then(({ data }) => ({
                  docs: (data || []).map((d) => ({
                    data: () => mapIncoming(d),
                    id: d.id,
                  })),
                  empty: (data || []).length === 0,
                }));
              },
              add: (data) => {
                const mapped = mapOutgoing(data);
                if (f === 'conversation_id') mapped.conversation_id = val;
                return supabase.from(name).insert([mapped]);
              },
            };
            return query;
          },
          add: (data) => supabase.from(name).insert([mapOutgoing(data)]),
        }),
      };
    },
    {
      FieldValue,
      batch: () => ({
        update: () => {},
        commit: () => Promise.resolve(),
      }),
    }
  ),
  locations: [
    'Hall 1',
    'Hall 2',
    'Hall 3',
    'Hall 4',
    'Hall 5',
    'Hall 6',
    'Hall 7',
    'Hall 8',
    'Hall 9',
    'Hall 10',
    'Hall 11',
    'Hall 13',
    'Hall 14',
    'Mother Teresa Hall',
    'Sister Nivedita Hall',
  ],
  notificationsRef,
  activityLogRef,
  searchesRef,
  reportsRef,
};
