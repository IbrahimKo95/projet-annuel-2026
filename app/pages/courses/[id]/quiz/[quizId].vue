<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div v-if="pending" class="flex justify-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="quiz" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ quiz.title }}</h1>
        
        <div v-if="!submitted">
          <div v-for="(question, index) in quiz.questions" :key="question.id" class="mb-12">
            <p class="text-lg font-medium text-gray-900 mb-4">
              {{ index + 1 }}. {{ question.text }}
            </p>
            <div class="space-y-3">
              <label v-for="answer in question.answers" :key="answer.id" class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="radio" 
                  :name="question.id" 
                  v-model="userAnswers[question.id]" 
                  :value="answer.id"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                >
                <span class="ml-3 text-gray-700">{{ answer.text }}</span>
              </label>
            </div>
          </div>

          <div class="mt-12 flex justify-end">
            <button 
              @click="submitQuiz" 
              :disabled="submitting || !isAllAnswered"
              class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ submitting ? 'Submitting...' : 'Submit Quiz' }}
            </button>
          </div>
        </div>

        <div v-else class="text-center py-12">
             <div class="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 text-green-600 text-4xl mb-6">
                ✅
             </div>
             <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Quiz Completed!</h2>
             <p class="text-2xl text-gray-600 mb-8">Your Score: <span class="text-indigo-600 font-bold">{{ score }}%</span></p>
             <NuxtLink :to="`/courses/${route.params.id}/learn`" class="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors">
                Continue Learning
             </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: quiz, pending } = await useFetch<any>(`/api/quizzes/${route.params.quizId}`)

const userAnswers = ref<Record<string, string>>({})
const submitting = ref(false)
const submitted = ref(false)
const score = ref(0)

const isAllAnswered = computed(() => {
  if (!quiz.value) return false
  return quiz.value.questions.every((q: any) => userAnswers.value[q.id])
})

async function submitQuiz() {
  submitting.value = true
  try {
    const response: any = await $fetch(`/api/quizzes/${route.params.quizId}/submit`, {
      method: 'POST',
      body: {
        answers: Object.entries(userAnswers.value).map(([questionId, answerId]) => ({
          questionId,
          answerId
        }))
      }
    })
    score.value = response.score
    submitted.value = true
  } catch (error) {
    console.error('Submission failed:', error)
  } finally {
    submitting.value = false
  }
}
</script>
