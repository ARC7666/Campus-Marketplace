import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import View from '../Components/View/View';
import { PostContext } from '../contextStore/PostContext';
import { supabase } from 'backend/config';
import BarLoading from '../Components/Loading/BarLoading';

function ViewPost() {
  const { adId } = useParams();
  const { setPostContent } = useContext(PostContext);
  const [ready, setReady] = useState(!adId);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!adId) {
      setReady(true);
      return;
    }
    // Reset state when adId changes to prevent showing stale seller data
    setReady(false);
    setNotFound(false);
    
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', adId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPostContent(data);
      }
      setReady(true);
    };

    fetchProduct();
  }, [adId, setPostContent]);

  if (!ready) {
    return (
      <Layout>
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}
        >
          <BarLoading />
        </div>
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p>Ad not found.</p>
          <a href="/">Go to Home</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <View />
    </Layout>
  );
}

export default ViewPost;
