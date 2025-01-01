// lib/auth.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CAL_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.CAL_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/calendar.readonly", // Access to Google Calendar
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // Save access token in JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Store the access token in the session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
