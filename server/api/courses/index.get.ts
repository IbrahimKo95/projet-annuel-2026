export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const category = query.category as string | undefined

    const courses = await prisma.course.findMany({
        where: {
            published: true,
            ...(category ? { category } : {})
        },
        include: {
            instructor: {
                select: {
                    name: true,
                    image: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return courses
})
