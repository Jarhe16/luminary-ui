import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Edge-safe NextAuth instance — uses only authConfig (no DB, no Node.js APIs)
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
