import { z } from 'zod'

const courseSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    category: z.string().optional(),
    thumbnail: z.string().optional(),
    prerequisites: z.string().optional()
})

import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session || (session.user as any).role !== 'INSTRUCTOR' && (session.user as any).role !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Unauthorized'
        })
    }

    const body = await readBody(event)
    const result = courseSchema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: result.error.format()
        })
    }

    const course = await prisma.course.create({
        data: {
            ...result.data,
            instructorId: (session.user as any).id,
        }
    })

    return course
})
