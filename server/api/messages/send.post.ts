import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const { receiverId, content } = await readBody(event)

    const message = await prisma.message.create({
        data: {
            content,
            senderId: (session.user as any).id,
            receiverId
        }
    })

    // Create notification for receiver
    await prisma.notification.create({
        data: {
            userId: receiverId,
            message: `New message from ${session.user.name || session.user.email}: ${content.substring(0, 50)}...`
        }
    })

    return message
})
