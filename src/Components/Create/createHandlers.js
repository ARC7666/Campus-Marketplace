import { getCategoryFields } from '../../data/categoryFields';
import { supabase } from 'firebase/config';
import { uploadProductImage } from '../../lib/supabaseProducts';
import { canProceed, RATE_LIMITS } from '../../utils/rateLimit';
import {
  validateAdDescription,
  validateAdTitle,
  validatePrice,
  validateRequired,
} from '../../utils/validation';

export function buildProductData(values, user, imageUrls, status, seller = {}) {
  return {
    user_id: user.id || user.uid,
    name: values.name.trim(),
    slug: (values.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: values.category,
    subcategory: values.subcategory || '',
    price: Number(values.price) || 0,
    original_price: values.originalPrice ?? null,
    description: (values.description || '').trim(),
    thumbnail_url: imageUrls?.[0] || '',
    images: imageUrls || [],
    url: imageUrls?.[0] || '',
    status: status,
    negotiable: Boolean(values.negotiable),
    listed_by: values.listedBy || '',
    ad_type: values.adType || 'for_sale',
    price_type: values.priceType || 'fixed',
    tags: Array.isArray(values.tags) ? values.tags : [],
    video_url: values.videoUrl || '',
    return_policy: values.returnPolicy || 'no_returns',
    payment_methods: Array.isArray(values.paymentMethods) ? values.paymentMethods : [],
    contact_preference: values.contactPreference || 'both',
    available_from: values.availableFrom || null,
    location: values.location || {},
    delivery: values.delivery || {},
    warranty: values.warranty || {},
    extra: values.extra || {},
    condition: values.condition || '',
    seller_name: seller.name || user.email?.split('@')[0] || 'User',
    seller_avatar: seller.avatar || '',
    seller_verified: Boolean(seller.verified),
    seller_badge_level: seller.badge_level || 'new',
  };
}

function scrollToFirstError(errors) {
  setTimeout(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;
    for (const key of errorKeys) {
      const cleanKey = key.replace('extra.', '');
      if (cleanKey === 'location') {
        const stateEl = document.getElementById('ad-location-state');
        const cityEl = document.getElementById('ad-location-city');
        const target = stateEl && !stateEl.value ? stateEl : cityEl;
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.focus({ preventScroll: true });
          return;
        }
      }
      const el = document.getElementById(`ad-${cleanKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
        return;
      }
    }
    const errorEl = document.querySelector('.cf-error');
    if (errorEl) {
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

export async function handleSubmit({
  values,
  user,
  addToast,
  history,
  setLoading,
  setErrors,
}) {
  if (!canProceed('adCreate', RATE_LIMITS.AD_CREATE_MS)) {
    addToast('Please wait a moment before posting another ad.', 'info');
    return;
  }
  const err = {};

  if (validateRequired(values.category, 'Category'))
    err.category = 'Please select a category.';

  const tErr = validateAdTitle(values.name);
  if (tErr) err.name = tErr;

  const dErr = validateAdDescription(values.description);
  if (dErr) err.description = dErr;

  const pErr = validatePrice(values.price);
  if (pErr) err.price = pErr;

  if (!values.condition?.trim()) err.condition = 'Please select a condition.';

  const filesToUpload = values.images.filter((i) => i instanceof File);
  const existingUrls = values.images.filter((i) => typeof i === 'string');
  if (filesToUpload.length === 0 && existingUrls.length === 0)
    err.images = 'Please add at least one image.';

  if (!values.location?.state || !values.location?.city)
    err.location = 'Please select your state and city.';

  const catFields = getCategoryFields(values.category);
  const extra = values.extra || {};
  catFields.forEach((f) => {
    if (f.required) {
      const val = extra[f.key];
      if (val === undefined || val === null || String(val).trim() === '') {
        err[`extra.${f.key}`] = `${f.label.replace(/\s*\*/, '')} is required`;
      }
    }
  });

  setErrors(err);
  if (Object.keys(err).length > 0) {
    const count = Object.keys(err).length;
    addToast(
      `Please fix ${count} error${count > 1 ? 's' : ''} before posting.`,
      'error'
    );
    scrollToFirstError(err);
    return;
  }

  setLoading(true);
  try {
    const uploadPromises = filesToUpload.map((file) => uploadProductImage(user.id || user.uid, file));
    const [urls, { data: profile }] = await Promise.all([
      Promise.all(uploadPromises),
      supabase.from('profiles').select('*').eq('id', user.id || user.uid).single(),
    ]);

    const data = buildProductData(values, user, [...existingUrls, ...urls], 'active', profile || {});
    const { error: insertError } = await supabase.from('products').insert([data]);

    if (insertError) throw insertError;

    addToast('Ad posted successfully!', 'success');
    history.push('/');
  } catch (error) {
    console.error('Submit error:', error);
    setLoading(false);
    addToast('Failed to post ad. Try again.', 'error');
  }
}

export async function handleSaveDraft({
  values,
  user,
  addToast,
  history,
  setLoading,
  setErrors,
}) {
  const err = {};
  if (!values.name && !values.category) {
    if (!values.name) err.name = 'Add a title to save draft.';
    if (!values.category) err.category = 'Select a category to save draft.';
  }
  if (setErrors) setErrors(err);
  if (Object.keys(err).length > 0) {
    addToast('Add at least a title or category to save draft.', 'error');
    scrollToFirstError(err);
    return;
  }

  setLoading(true);
  try {
    const filesToUpload = values.images.filter((i) => i instanceof File);
    const existingUrls = values.images.filter((i) => typeof i === 'string');
    
    const uploadPromises = filesToUpload.map((file) => uploadProductImage(user.id || user.uid, file));
    const [urls, { data: profile }] = await Promise.all([
      Promise.all(uploadPromises),
      supabase.from('profiles').select('*').eq('id', user.id || user.uid).single(),
    ]);

    const data = buildProductData(
      values,
      user,
      [...existingUrls, ...urls],
      'draft',
      profile || {}
    );
    const { error: insertError } = await supabase.from('products').insert([data]);

    if (insertError) throw insertError;

    setLoading(false);
    addToast('Draft saved successfully!', 'success');
    history.push('/dashboard');
  } catch (e) {
    setLoading(false);
    addToast('Failed to save draft. Please try again.', 'error');
    console.error('Draft save error:', e);
  }
}
