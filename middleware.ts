import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return response;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: values => values.forEach(({ name, value, options }) => { response.cookies.set(name, value, options); }),
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const protectedPath = ['/account', '/cart', '/checkout', '/vendor', '/admin'];
  if (protectedPath.some(path => request.nextUrl.pathname.startsWith(path)) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = { matcher: ['/account/:path*', '/cart/:path*', '/checkout/:path*', '/vendor/:path*', '/admin/:path*'] };
