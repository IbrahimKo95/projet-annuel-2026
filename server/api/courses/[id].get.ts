export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            instructor: {
                select: {
                    name: true,
                    image: true
                }
            },
            modules: {
                include: {
                    lessons: true,
                    quizzes: true
                },
                orderBy: {
                    order: 'asc'
                }
            }
        }
    })

    if (!course) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Course not found'
        })
    }

    return course
})
