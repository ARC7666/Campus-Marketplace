import { supabase } from 'backend/config';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePhone,
} from '../../utils/validation';

export async function handleSocialSignUp(providerName, { setLoading, setErrors, addToast, history }) {
  setLoading(true);
  setErrors({});
  const { error } = await supabase.auth.signInWithOAuth({
    provider: providerName,
    options: {
      redirectTo: window.location.origin + '/',
    },
  });

  if (error) {
    setLoading(false);
    setErrors({
      form: error.message || 'Something went wrong. Please try again.',
    });
  }
}

export function handleGuestContinue({ addToast, history }) {
  addToast('Browsing as guest. Sign up to post ads or chat.', 'info');
  history.push('/');
}

export async function handleSubmit(e, { name, email, phone, password, termsAccepted, setLoading, setErrors, addToast, history }) {
  e.preventDefault();
  const err = {};
  if (validateRequired(name, 'Full name'))
    err.name = 'Full name is required.';
  const eErr = validateEmail(email);
  if (eErr) err.email = eErr;
  const pErr = validatePhone(phone);
  if (pErr) err.phone = pErr;
  const pwErr = validatePassword(password);
  if (pwErr) err.password = pwErr;
  if (!termsAccepted) err.terms = 'You must accept the Terms and Conditions.';
  setErrors(err);
  if (Object.keys(err).length > 0) return;

  setLoading(true);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name.trim(),
        phone: String(phone).trim(),
      },
    },
  });

  if (error) {
    setLoading(false);
    setErrors({ form: error.message || 'Something went wrong. Please try again.' });
  } else {
    addToast('Account created. Check your email to verify, then log in.', 'success');
    history.push('/login');
  }
}
