<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <div v-if="pending" class="flex justify-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="course">
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
                {{ course.title }}
              </h1>
              <div class="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 sm:mt-2">
                <div class="flex items-center text-sm text-gray-500">
                  <span class="mr-1.5 h-5 w-5 text-gray-400">👤</span>
                  {{ course.instructor.name }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <span class="mr-1.5 h-5 w-5 text-gray-400">📁</span>
                  {{ course.category || 'Général' }}
                </div>
              </div>
            </div>
            <div class="mt-6 flex md:mt-0 md:ml-4">
              <button v-if="enrollment" @click="goToLearning" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Aller au cours
              </button>
              <button v-else @click="enroll" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                S'inscrire maintenant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="lg:col-span-2">
            <section>
              <h2 class="text-2xl font-bold text-gray-900">À propos de ce cours</h2>
              <p class="mt-4 text-gray-600 whitespace-pre-wrap">{{ course.description }}</p>
            </section>

            <section class="mt-12">
              <h2 class="text-2xl font-bold text-gray-900">Contenu du cours</h2>
              <div class="mt-6 space-y-4">
                <div v-for="module in course.modules" :key="module.id" class="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div class="px-4 py-5 sm:px-6 bg-gray-50">
                    <h3 class="text-lg font-medium text-gray-900">{{ module.title }}</h3>
                  </div>
                  <ul class="divide-y divide-gray-200 border-t border-gray-200">
                    <li v-for="lesson in module.lessons" :key="lesson.id" class="px-4 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                      <div class="flex items-center">
                        <span class="text-gray-400 mr-3">📄</span>
                        <span class="text-sm font-medium text-gray-900">{{ lesson.title }}</span>
                      </div>
                    </li>
                    <li v-for="quiz in module.quizzes" :key="quiz.id" class="px-4 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                      <div class="flex items-center">
                        <span class="text-indigo-400 mr-3">📝</span>
                        <span class="text-sm font-medium text-gray-900 italic font-bold">Quiz: {{ quiz.title }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div class="mt-12 lg:mt-0">
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900">Prérequis</h3>
              <p class="mt-4 text-sm text-gray-500">{{ course.prerequisites || 'Aucun' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-24">
      <p class="text-gray-500">Cours non trouvé.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: course, pending } = await useFetch<any>(`/api/courses/${route.params.id}`)
const { status } = useAuth()
const { data: enrollment } = await useFetch<any>(`/api/enrollments/check?courseId=${route.params.id}`, {
  key: `enrollment-${route.params.id}`
})

async function enroll() {
  if (status.value !== 'authenticated') {
    return navigateTo(`/login?callbackUrl=${route.path}`)
  }

  try {
    await $fetch('/api/courses/enroll', {
      method: 'POST',
      body: { courseId: route.params.id }
    })
    navigateTo(`/courses/${route.params.id}/learn`)
  } catch (err) {
    console.error('Enrollment failed:', err)
    alert("L'inscription a échoué")
  }
}

function goToLearning() {
  navigateTo(`/courses/${route.params.id}/learn`)
}
</script>
