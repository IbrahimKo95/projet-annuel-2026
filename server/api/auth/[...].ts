// @ts-ignore
import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from '@auth/core/providers/credentials'
import { prisma } from '../../utils/prisma'
import * as bcrypt from 'bcrypt'

export default NuxtAuthHandler({
    secret: process.env.NUXT_AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) return null
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })
                if (!user) return null

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                if (!isPasswordCorrect) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt: async ({ token, user }: any) => {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        session: async ({ session, token }: any) => {
            if (session.user) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
})