import { useState, useEffect } from 'react';
import { supabase } from 'backend/config';

export function useViewData(postContent, history, viewerUid) {
  const [userDetails, setUserDetails] = useState();
  const [viewerIsPremium, setViewerIsPremium] = useState(false);

  const userIdRequested = postContent?.user_id || postContent?.userId;

  useEffect(() => {
    if (userIdRequested === undefined) {
      // history.push('/'); // Commented out to prevent accidental redirects if data is loading
    } else if (userIdRequested) {
      setUserDetails(undefined);
      const fetchUser = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userIdRequested)
          .single();

        if (data) setUserDetails(data);
      };
      fetchUser();
    }
  }, [history, userIdRequested]);

  useEffect(() => {
    if (!viewerUid) {
      setViewerIsPremium(false);
      return;
    }
    const fetchViewer = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', viewerUid)
        .single();

      if (data) {
        // Simple premium check based on premium_member column
        setViewerIsPremium(data.premium_member || false);
      }
    };
    fetchViewer();
  }, [viewerUid]);

  useEffect(() => {
    if (postContent?.id) {
      // Using direct update for view count. 
      // Note: stats is a JSONB column in our schema.
      const incrementView = async () => {
        // This is a bit tricky with JSONB. Best handled with RPC in Supabase.
        // For now, let's assume we have an RPC or we update the whole object.
        // In a real migration, you'd add:
        // supabase.rpc('increment_view_count', { product_id: postContent.id })
        await supabase.rpc('increment_product_views', { product_id: postContent.id });
      };
      incrementView();
    }
  }, [postContent?.id]);

  return { userDetails, setUserDetails, viewerIsPremium };
}
