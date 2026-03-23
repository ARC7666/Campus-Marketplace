import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { AuthContext } from '../contextStore/AuthContext';
import { supabase } from 'backend/config';
import { formatPrice } from '../utils/formatters';
import './Transactions.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function StatusBadge({ status }) {
  const map = {
    active:  { label: 'Active',   color: '#16a34a' },
    pending: { label: 'Pending',  color: '#d97706' },
    sold:    { label: 'Sold',     color: '#6b7280' },
    draft:   { label: 'Draft',    color: '#9ca3af' },
    expired: { label: 'Expired',  color: '#ef4444' },
  };
  const s = map[status] || { label: status, color: '#6b7280' };
  return (
    <span style={{
      background: s.color, color: '#fff', borderRadius: 12,
      padding: '2px 10px', fontSize: 12, fontWeight: 600,
    }}>{s.label}</span>
  );
}

function TransactionsPage() {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('buying');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || user?.uid;

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    setItems([]);

    async function fetchData() {
      if (tab === 'selling') {
        // All products listed by this seller (queue + sold + active)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error) setItems(data || []);
      } else {
        // Items the user has contacted/started a conversation about (buying intent)
        const { data: convs, error } = await supabase
          .from('conversations')
          .select('*, products(*)')
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false });

        if (!error) {
          setItems((convs || []).map(c => ({
            ...c.products,
            conversation_id: c.id,
            conv_created_at: c.created_at,
            seller_name: c.products?.seller_name || 'Seller',
          })));
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [userId, tab]);

  if (!user) {
    return (
      <Layout>
        <div className="transactionsPage">
          <p>Please <Link to="/login">log in</Link> to view your transactions.</p>
        </div>
      </Layout>
    );
  }

  const queueItems  = tab === 'selling' ? items.filter(p => p.status === 'active' || p.status === 'pending') : [];
  const soldItems   = tab === 'selling' ? items.filter(p => p.status === 'sold') : [];
  const buyingItems = tab === 'buying'  ? items : [];

  return (
    <Layout>
      <div className="transactionsPage">
        <h1>My Transactions</h1>

        {/* Tab selector */}
        <div className="transactionsTabs">
          <button type="button" className={tab === 'buying'  ? 'active' : ''} onClick={() => setTab('buying')}>
            🛒 Buying History
          </button>
          <button type="button" className={tab === 'selling' ? 'active' : ''} onClick={() => setTab('selling')}>
            🏷️ Selling History
          </button>
        </div>

        {loading ? (
          <p style={{ padding: 24 }}>Loading…</p>
        ) : tab === 'selling' ? (
          <>
            {/* ON QUEUE */}
            <section>
              <h2 style={{ fontSize: 16, margin: '24px 0 8px', color: '#374151' }}>
                🟡 On Queue ({queueItems.length})
              </h2>
              {queueItems.length === 0 ? (
                <p className="transactionsEmpty">No active listings.</p>
              ) : (
                <ul className="transactionsList">
                  {queueItems.map(p => (
                    <ProductRow key={p.id} product={p} role="seller" />
                  ))}
                </ul>
              )}
            </section>

            {/* SOLD */}
            <section>
              <h2 style={{ fontSize: 16, margin: '24px 0 8px', color: '#374151' }}>
                ✅ Previously Sold ({soldItems.length})
              </h2>
              {soldItems.length === 0 ? (
                <p className="transactionsEmpty">No sold items yet.</p>
              ) : (
                <ul className="transactionsList">
                  {soldItems.map(p => (
                    <ProductRow key={p.id} product={p} role="seller" />
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : (
          /* BUYING */
          <section>
            <h2 style={{ fontSize: 16, margin: '24px 0 8px', color: '#374151' }}>
              Items you've inquired about ({buyingItems.length})
            </h2>
            {buyingItems.length === 0 ? (
              <p className="transactionsEmpty">
                No buying history yet. Browse ads and chat with sellers to get started!
              </p>
            ) : (
              <ul className="transactionsList">
                {buyingItems.map(p => (
                  <ProductRow key={p.conversation_id || p.id} product={p} role="buyer" />
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
}

function ProductRow({ product, role }) {
  const thumb = product.thumbnail_url || (product.images || [])[0] || product.url;
  const date = role === 'buyer' ? product.conv_created_at : (product.sold_at || product.created_at);
  return (
    <li className="transactionsItem">
      <div className="transactionsItemImage">
        {thumb ? <img src={thumb} alt="" /> : <span>📦</span>}
      </div>
      <div className="transactionsItemBody">
        <Link to={`/ad/${product.id}`} className="transactionsItemTitle">
          {product.name || product.title || 'Ad'}
        </Link>
        <p className="transactionsItemMeta">
          {role === 'buyer' ? `Seller: ${product.seller_name || '—'}` : `Listed by you`}
        </p>
        <p className="transactionsItemAmount">{formatPrice(product.price)}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
          <StatusBadge status={product.status} />
          {date && <span className="transactionsItemDate">{formatDate(date)}</span>}
        </div>
        {role === 'buyer' && (
          <Link to={`/chat/${product.conversation_id}`} style={{ fontSize: 13, color: '#2563eb', marginTop: 4, display: 'inline-block' }}>
            💬 Continue chat
          </Link>
        )}
      </div>
    </li>
  );
}

export default TransactionsPage;
