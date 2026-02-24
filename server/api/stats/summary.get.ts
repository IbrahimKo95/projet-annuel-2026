import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session || (session.user as any).role !== 'INSTRUCTOR' && (session.user as any).role !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Unauthorized'
        })
    }

    const courseCount = await prisma.course.count()
    const userCount = await prisma.user.count()
    const resultAvg = await prisma.result.aggregate({
        _avg: { score: true }
    })

    const topCourses = await prisma.course.findMany({
        take: 5,
        include: {
            _count: {
                select: { enrollments: true }
            }
        },
        orderBy: {
            enrollments: { _count: 'desc' }
        }
    })

    return {
        stats: {
            courses: courseCount,
            users: userCount,
            averageScore: resultAvg._avg.score || 0
        },
        topCourses
    }
})
