const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function run() {
  const uid1 = 'userA' + Date.now().toString().slice(-6);
  console.log('Creating seller...');
  const { data: auth1, error: e1 } = await sb.auth.signUp({ email: uid1 + '@gmail.com', password: 'password123' });
  if (e1) return console.log('Signup1 error:', e1.message);
  const sellerId = auth1.user.id;

  const uid2 = 'userB' + Date.now().toString().slice(-6);
  console.log('Creating buyer...');
  const { data: auth2, error: e2 } = await sb.auth.signUp({ email: uid2 + '@gmail.com', password: 'password123' });
  if (e2) return console.log('Signup2 error:', e2.message);
  const buyerId = auth2.user.id;

  console.log('Logging in as seller...');
  await sb.auth.signInWithPassword({ email: uid1 + '@test.com', password: 'password123' });

  console.log('Creating product...');
  const { data: p, error: ep } = await sb.from('products').insert([{ name: 'Test Product', price: '1000', category: 'Books', user_id: sellerId, description: 'Desc' }]).select().single();
  if (ep) return console.log('Prod error:', ep.message);

  console.log('Logging in as buyer...');
  await sb.auth.signInWithPassword({ email: uid2 + '@test.com', password: 'password123' });

  // Add a slight delay to ensure auth context is fully propagated
  await new Promise(r => setTimeout(r, 1000));

  console.log('Inserting offer...');
  const { data: o, error: eo } = await sb.from('offers').insert([{ 
    product_id: p.id, 
    product_name: p.name, 
    seller_id: sellerId, 
    buyer_id: buyerId, 
    offer_amount: 900, 
    original_price: 1000, 
    payment_method: 'Cash', 
    delivery_preference: 'Pickup', 
    status: 'pending' 
  }]).select().single();
  
  if (eo) {
    console.log('Offer error:', eo);
    return;
  }
  
  console.log('SUCCESS! Offer Created:', o.id);

  console.log('Logging in as seller to view offers...');
  await sb.auth.signInWithPassword({ email: uid1 + '@test.com', password: 'password123' });
  
  const { data: receivedList, error: elist } = await sb.from('offers').select('*').eq('seller_id', sellerId);
  if (elist) return console.log('Seller view error:', elist);
  
  console.log('Seller sees offers:', receivedList.length);
}

run();
