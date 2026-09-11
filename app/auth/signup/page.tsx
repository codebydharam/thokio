import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function SignupPage() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-10"><Link href="/" className="text-sm font-bold text-amber-700">← Back to ThokIO</Link><h1 className="mt-10 text-4xl font-black tracking-[-.05em]">Create your account</h1><p className="mt-3 text-slate-500">Shop retail or unlock better wholesale pricing.</p><AuthForm mode="signup" /><p className="mt-8 text-center text-sm text-slate-500">Already registered? <Link href="/auth/login" className="font-bold text-amber-700">Sign in</Link></p></div></main>;
}
