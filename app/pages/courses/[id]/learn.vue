<template>
  <div class="flex h-screen bg-white overflow-hidden">
    <!-- Sidebar Course Outline -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg">
        <div class="px-6 py-4 border-b border-gray-200 bg-white">
          <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mb-4 transition">
            <span class="mr-2">←</span> Retour à l'accueil
          </NuxtLink>
          <h2 class="text-xl font-bold text-gray-900 line-clamp-2">{{ course?.title }}</h2>
          <div class="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${progress}%` }"></div>
          </div>
          <p class="mt-2 text-xs text-gray-500 font-medium uppercase tracking-wider">{{ progress }}% terminé</p>
        </div>
      
      <div v-if="pending" class="p-6 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <nav v-else class="flex-1 px-4 py-4 space-y-4">
        <div v-for="module in course?.modules" :key="module.id">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {{ module.title }}
          </h3>
          <ul class="space-y-1">
            <li v-for="lesson in module.lessons" :key="lesson.id">
              <button 
                @click="currentLessonId = lesson.id"
                class="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors"
                :class="currentLessonId === lesson.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <span class="mr-3 text-lg" :class="currentLessonId === lesson.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'">
                  📄
                </span>
                <span class="text-left truncate">{{ lesson.title }}</span>
              </button>
            </li>
            <li v-for="quiz in module.quizzes" :key="quiz.id">
              <button 
                @click="currentQuizId = quiz.id"
                class="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors"
                :class="currentQuizId === quiz.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <span class="mr-3 text-lg text-indigo-400">📝</span>
                <span class="text-left font-bold truncate">Quiz: {{ quiz.title }}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Main Content Player -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Top header with progress -->
      <header class="h-16 border-b border-gray-200 px-8 flex items-center justify-between bg-white flex-shrink-0">
        <div class="flex items-center space-x-4">
           <div class="w-48 bg-gray-200 rounded-full h-2.5">
            <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${progress}%` }"></div>
          </div>
          <span class="text-xs text-gray-500 italic">{{ progress }}% Terminé</span>
        </div>
      </header>

      <!-- Lesson View -->
      <main class="flex-1 overflow-y-auto p-12 bg-white">
        <div v-if="currentLesson" class="max-w-4xl mx-auto">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-8">{{ currentLesson.title }}</h1>
          
          <!-- Video Section -->
          <div v-if="currentLesson.videoUrl" class="aspect-video w-full bg-black rounded-xl overflow-hidden mb-12 shadow-2xl">
            <template v-if="isYouTube(currentLesson.videoUrl)">
              <iframe 
                class="w-full h-full"
                :src="`https://www.youtube.com/embed/${getYouTubeId(currentLesson.videoUrl)}`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </template>
            <template v-else>
              <video 
                class="w-full h-full" 
                controls
                :src="currentLesson.videoUrl"
              >
                Your browser does not support the video tag.
              </video>
            </template>
          </div>

          <!-- Content Section -->
          <div class="prose prose-indigo prose-lg max-w-none text-gray-600 leading-relaxed italic">
            <p v-if="currentLesson.content" class="whitespace-pre-wrap">{{ currentLesson.content }}</p>
            <p v-else>Aucun contenu disponible pour cette leçon.</p>
          </div>

            <!-- Navigation Buttons -->
            <div class="mt-16 flex items-center justify-between pt-10 border-t border-gray-200">
              <button @click="goToPrevious" :disabled="isFirstLesson" class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition">
                ← Leçon précédente
              </button>
              <button @click="completeLesson" class="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                {{ isLastLesson ? 'Terminer le cours' : 'Leçon suivante' }} →
              </button>
            </div>
        </div>

        <div v-else-if="!pending" class="h-full flex flex-col items-center justify-center text-gray-400">
           <span class="text-6xl mb-4">📖</span>
           <p class="text-xl font-medium">Sélectionnez une leçon pour commencer</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: course, pending } = await useFetch<any>(`/api/courses/${route.params.id}`)

const currentLessonId = ref<string | null>(null)
const currentQuizId = ref<string | null>(null)

// Initialize with first lesson
watch(course, (newCourse) => {
  if (newCourse?.modules?.[0]?.lessons?.[0] && !currentLessonId.value) {
    currentLessonId.value = newCourse.modules[0].lessons[0].id
  }
}, { immediate: true })

const currentLesson = computed(() => {
  if (!course.value || !currentLessonId.value) return null
  for (const module of course.value.modules) {
    const lesson = module.lessons.find((l: any) => l.id === currentLessonId.value)
    if (lesson) return lesson
  }
  return null
})

const allLessons = computed(() => {
  return course.value?.modules.flatMap((m: any) => m.lessons) || []
})

const currentIndex = computed(() => {
  return allLessons.value.findIndex((l: any) => l.id === currentLessonId.value)
})

const isFirstLesson = computed(() => currentIndex.value <= 0)
const isLastLesson = computed(() => currentIndex.value === allLessons.value.length - 1)

const progress = computed(() => {
  if (allLessons.value.length === 0) return 0
  return Math.round(((currentIndex.value + 1) / allLessons.value.length) * 100)
})

function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function goToPrevious() {
  if (currentIndex.value > 0) {
    currentLessonId.value = allLessons.value[currentIndex.value - 1].id
  }
}

async function completeLesson() {
  if (!currentLessonId.value) return

  try {
    const totalLessons = allLessons.value.length
    const progress = Math.round(((currentIndex.value + 1) / totalLessons) * 100)
    
    await $fetch('/api/courses/progress', {
      method: 'POST',
      body: {
        courseId: course.value.id,
        progress
      }
    })
    
    if (isLastLesson.value) {
      alert('Cours terminé ! Félicitations !')
      navigateTo('/')
    } else {
      currentLessonId.value = allLessons.value[currentIndex.value + 1].id
    }
  } catch (err) {
    console.error('Failed to update progress:', err)
  }
}

definePageMeta({
  layout: false,
  middleware: 'auth'
})
</script>
