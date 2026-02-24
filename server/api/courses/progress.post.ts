import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const { courseId, progress } = await readBody(event)

    const enrollment = await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: (session.user as any).id,
                courseId
            }
        },
        update: {
            progress: progress
        },
        create: {
            userId: (session.user as any).id,
            courseId,
            progress: progress
        }
    })

    return enrollment
})
