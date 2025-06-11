import NextAuth from 'next-auth'

const handler = NextAuth({
  providers: [],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
  },
})

export { handler as GET, handler as POST } 