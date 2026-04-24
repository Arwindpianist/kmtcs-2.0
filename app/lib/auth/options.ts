import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { runNeonQuery } from '@/app/lib/db/neon';
import { verifyPassword } from '@/app/lib/auth/password';

type DbUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'editor';
  password_hash: string | null;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const result = await runNeonQuery<DbUserRow>(
          'SELECT id, email, full_name, role, password_hash FROM users WHERE lower(email) = $1 LIMIT 1',
          [email]
        );
        const user = result.rows[0];

        if (!user?.password_hash) {
          return null;
        }

        const isValidPassword = await verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name || user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'admin' | 'editor';
      }
      return session;
    },
  },
};
