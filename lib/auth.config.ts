import type { NextAuthConfig } from 'next-auth';

// Edge-safe auth config — no DB imports, no Node.js APIs.
// Used by proxy.ts (Edge Runtime) to check session validity only.
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const role = (auth?.user as any)?.role;

      // Always public — marketing pages and auth routes
      const publicPaths = [
        '/auth/login', '/auth/register',
        '/how-it-works', '/plans', '/about', '/contact', '/terms', '/privacy',
      ];
      const isPublic = publicPaths.some(p => pathname.startsWith(p));
      const isApiAuth = pathname.startsWith('/api/auth');
      const isApiRegister = pathname.startsWith('/api/register');
      const isMarketingHome = pathname === '/';

      if (isPublic || isApiAuth || isApiRegister || isMarketingHome) return true;

      // Must be logged in for everything else
      if (!isLoggedIn) return false;

      // Admin routes require admin role
      if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        return role === 'admin';
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role;
        token.tier = (user as any).tier;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id            = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).tier = token.tier;
      }
      return session;
    },
  },
};
