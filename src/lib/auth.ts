import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { AuthOptions, getServerSession } from "next-auth"
import GithubProvider from "next-auth/providers/github"

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
}

export const getServerSessionHelper = () => getServerSession(authOptions)

export const getServerSessionUserId = async () => {
  const session = await getServerSessionHelper()
  const idStr = session?.user?.id as string

  return Number.parseInt(idStr)
}
