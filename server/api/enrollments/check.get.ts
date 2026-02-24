import { getServerSession } from '#auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) return null

    const { courseId } = getQuery(event)

    if (!courseId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing courseId'
        })
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: (session.user as any).id,
                courseId: courseId as string
            }
        }
    })

    return enrollment
})
