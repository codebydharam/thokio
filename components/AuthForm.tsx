'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

const schema = z.object({ email: z.string().email(), password: z.string().min(8), fullName: z.string().min(2).optional() });
type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function submit(values: FormValues) {
    const supabase = createSupabaseBrowserClient();
    setBusy(true); setError(''); setMessage('');
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
      : await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { full_name: values.fullName } } });
    if (result.error) setError(result.error.message);
    else if (mode === 'signup') setMessage('Check your email to verify your account.');
    else router.push(new URLSearchParams(window.location.search).get('next') ?? '/account');
    setBusy(false);
  }

  async function google() { const supabase = createSupabaseBrowserClient(); await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } }); }

  return <form onSubmit={handleSubmit(submit)} className="mt-8 grid gap-4"><button type="button" onClick={google} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-ink hover:border-amber-400"><span className="font-black text-blue-600">G</span> Continue with Google</button><div className="flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or use email<span className="h-px flex-1 bg-slate-200" /></div>{mode === 'signup' && <label className="grid gap-2 text-sm font-bold">Full name<input {...register('fullName')} className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-amber-500" placeholder="Aarav Mehta" />{errors.fullName && <span className="text-xs text-rose-600">{errors.fullName.message}</span>}</label>}<label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Mail size={15} /> Email</span><input {...register('email')} type="email" className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-amber-500" placeholder="you@company.com" />{errors.email && <span className="text-xs text-rose-600">{errors.email.message}</span>}</label><label className="grid gap-2 text-sm font-bold">Password<input {...register('password')} type="password" className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-amber-500" placeholder="At least 8 characters" />{errors.password && <span className="text-xs text-rose-600">{errors.password.message}</span>}</label>{error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}<button disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-ink py-3.5 font-bold text-white hover:bg-indigo-900 disabled:opacity-60">{busy && <Loader2 className="animate-spin" size={16} />}{mode === 'login' ? 'Sign in' : 'Create account'}</button>{mode === 'login' && <button type="button" onClick={async () => { const email = window.prompt('Enter your email'); if (email) await createSupabaseBrowserClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` }); }} className="text-sm font-semibold text-amber-700">Forgot password?</button>}<p className="flex items-center justify-center gap-1 text-center text-xs text-slate-400"><ShieldCheck size={14} /> Your account is protected by Supabase Auth</p></form>;
}
