import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: (session.user as any).id },
                { receiverId: (session.user as any).id }
            ]
        },
        include: {
            sender: { select: { name: true, email: true } },
            receiver: { select: { name: true, email: true } }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return messages
})
