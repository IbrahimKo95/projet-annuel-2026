import bcrypt from 'bcrypt'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'INSTRUCTOR', 'LEARNER']).default('LEARNER')
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const result = registerSchema.safeParse(body)
    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: result.error.format()
        })
    }

    const { email, password, name, role } = result.data

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'User already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role
        }
    })

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    }
})
