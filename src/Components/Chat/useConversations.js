import { useState, useEffect } from 'react';
import { getConversationsForUser } from 'backend/config';

export function useConversations(currentUserId, retryTrigger) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      setError(null);
      return;
    }
    setError(null);
    const unsub = getConversationsForUser(currentUserId).onSnapshot(
      (snapshot) => {
        setConversations(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('ChatList: failed to load conversations', err);
        if (err?.message?.includes('index')) {
          console.error('You may need to create a Firestore composite index. Check the error URL above.');
        }
        setError('Failed to load conversations. Please try again.');
        setLoading(false);
      }
    );
    return () => unsub && unsub();
  }, [currentUserId, retryTrigger]);

  return { conversations, loading, error };
}

export function filterConversationsByTab(conversations, activeTab, currentUserId) {
  return conversations.filter((conv) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'buying') return conv.buyer_id === currentUserId;
    if (activeTab === 'selling') return conv.seller_id === currentUserId;
    return true;
  });
}
