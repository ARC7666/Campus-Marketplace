const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function run() {
  const timestamp = Date.now().toString().slice(-6);
  const sellerEmail = `seller${timestamp}@test.com`;
  const buyerEmail = `buyer${timestamp}@test.com`;
  const password = 'password123';

  console.log('Creating seller...');
  const { data: auth1, error: e1 } = await sb.auth.signUp({ email: sellerEmail, password });
  if (e1) return console.log('Signup1 error:', e1.message);
  const sellerId = auth1.user.id;
  // Ensure profile exists (if there's a trigger, skip. If not, insert)
  await sb.from('profiles').upsert({ id: sellerId, email: sellerEmail, name: 'Seller User' });

  console.log('Creating buyer...');
  const { data: auth2, error: e2 } = await sb.auth.signUp({ email: buyerEmail, password });
  if (e2) return console.log('Signup2 error:', e2.message);
  const buyerId = auth2.user.id;
  await sb.from('profiles').upsert({ id: buyerId, email: buyerEmail, name: 'Buyer User' });

  console.log('Logging in as seller to create product...');
  const { error: login1Err } = await sb.auth.signInWithPassword({ email: sellerEmail, password });
  if (login1Err) return console.log('Login1 error:', login1Err.message);

  console.log('Creating product...');
  const { data: p, error: ep } = await sb.from('products').insert([{ 
    name: 'Test Product ' + timestamp, 
    price: 1000, 
    category: 'Books', 
    user_id: sellerId, 
    description: 'A test product' 
  }]).select().single();
  if (ep) return console.log('Prod error:', ep.message);

  console.log('Logging in as buyer to send offer...');
  const { error: login2Err } = await sb.auth.signInWithPassword({ email: buyerEmail, password });
  if (login2Err) return console.log('Login2 error:', login2Err.message);

  // Add a slight delay to ensure auth context is fully propagated
  await new Promise(r => setTimeout(r, 1000));

  console.log('Inserting offer...');
  const { data: o, error: eo } = await sb.from('offers').insert([{ 
    product_id: p.id, 
    product_name: p.name, 
    seller_id: sellerId, 
    buyer_id: buyerId, 
    amount: 900, 
    original_price: 1000, 
    payment_method: 'Cash', 
    delivery_preference: 'Pickup', 
    message: 'I want to buy this!',
    status: 'pending' 
  }]).select().single();
  
  if (eo) {
    console.log('Offer error:', eo);
    return;
  }
  
  console.log('SUCCESS! Offer Created:', o.id);

  console.log('Logging in as seller to view offers...');
  await sb.auth.signInWithPassword({ email: sellerEmail, password });
  
  const { data: receivedList, error: elist } = await sb.from('offers').select('*').eq('seller_id', sellerId);
  if (elist) return console.log('Seller view error:', elist);
  
  console.log('Seller sees offers:', receivedList.length);
}

run();
