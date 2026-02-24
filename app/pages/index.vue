<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Apprenez des meilleurs, <span class="text-indigo-600">partout.</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Accédez à des cours de haute qualité dispensés par des experts. Commencez votre parcours d'apprentissage dès aujourd'hui.
        </p>
      </div>

      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Cours à la une</h2>
        
        <div v-if="pending" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <div v-else-if="courses?.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="course in courses" :key="course.id" class="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
            <div class="flex-shrink-0">
              <img class="h-48 w-full object-cover" :src="course.thumbnail || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'" alt="">
            </div>
            <div class="flex-1 p-6 flex flex-col justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-indigo-600">
                  {{ course.category || 'Général' }}
                </p>
                <NuxtLink :to="`/courses/${course.id}`" class="block mt-2">
                  <p class="text-xl font-semibold text-gray-900">{{ course.title }}</p>
                  <p class="mt-3 text-base text-gray-500 line-clamp-3">{{ course.description }}</p>
                </NuxtLink>
              </div>
              <div class="mt-6 flex items-center">
                <div class="flex-shrink-0">
                  <img class="h-10 w-10 rounded-full" :src="course.instructor.image || 'https://ui-avatars.com/api/?name=' + course.instructor.name" alt="">
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ course.instructor.name }}
                  </p>
                  <div class="flex space-x-1 text-sm text-gray-500">
                    <time :datetime="course.createdAt">
                      {{ new Date(course.createdAt).toLocaleDateString() }}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">Aucun cours disponible pour le moment. Revenez bientôt !</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: courses, pending } = await useFetch<any>('/api/courses')
</script>
