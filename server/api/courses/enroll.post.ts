import { getServerSession } from '#auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const { courseId } = await readBody(event)

    const enrollment = await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: (session.user as any).id,
                courseId
            }
        },
        update: {},
        create: {
            userId: (session.user as any).id,
            courseId
        }
    })

    return enrollment
})
