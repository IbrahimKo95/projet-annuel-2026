import { z } from 'zod'
import { getServerSession } from '#auth'

const submissionSchema = z.object({
    answers: z.array(z.object({
        questionId: z.string(),
        answerId: z.string()
    }))
})

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const quizId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const result = submissionSchema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request'
        })
    }

    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
            questions: {
                include: {
                    answers: true
                }
            }
        }
    })

    if (!quiz) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Quiz not found'
        })
    }

    let correctCount = 0
    const totalQuestions = quiz.questions.length

    for (const submission of result.data.answers) {
        const question = quiz.questions.find((q: any) => q.id === submission.questionId)
        if (question) {
            const isCorrect = (question as any).answers.some((a: any) => a.id === submission.answerId && a.isCorrect)
            if (isCorrect) correctCount++
        }
    }

    const score = (correctCount / totalQuestions) * 100

    const storedResult = await prisma.result.create({
        data: {
            score,
            timeSpent: 0, // Simplified
            userId: (session.user as any).id,
            quizId: quiz.id
        }
    })

    return {
        score,
        correctCount,
        totalQuestions,
        resultId: storedResult.id
    }
})
