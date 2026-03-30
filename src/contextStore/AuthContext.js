import React, { useState, createContext, useEffect, useMemo } from 'react';
import { supabase } from 'backend/config';

export const AuthContext = createContext(null);

function ContextAuth({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const u = session?.user;
        setUser(u ? { 
          ...u, 
          uid: u.id, 
          displayName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] 
        } : null);
      } catch (err) {
        console.error('Error in setupAuth:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    setupAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user;
        setUser(u ? { 
          ...u, 
          uid: u.id, 
          displayName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] 
        } : null);
        setAuthLoading(false);

        // Only clean up tokens from the URL if we actually have a session (user is signed in)
        if (session) {
          const hasTokens = window.location.hash.includes('access_token=') || 
                           window.location.hash.includes('code=') || 
                           window.location.search.includes('code=');
                           
          if (hasTokens) {
            // Delay slightly to ensure SDK has fully processed state
            setTimeout(() => {
              window.history.replaceState(null, null, window.location.pathname);
              console.log('Cleaned auth tokens from URL after successful session');
            }, 100);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ user, setUser, authLoading }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default ContextAuth;
