<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
          Instructor Dashboard
        </h1>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button @click="showCreateModal = true" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create New Course
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-12">
      <div v-for="(value, label) in stats" :key="label" class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate uppercase">{{ label }}</dt>
          <dd class="mt-1 text-3xl font-semibold text-indigo-600">{{ value }}</dd>
        </div>
      </div>
    </div>

    <!-- Course List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="course in instructorCourses" :key="course.id">
          <div class="px-4 py-4 flex items-center sm:px-6">
            <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
              <div class="truncate">
                <div class="flex text-sm">
                  <p class="font-medium text-indigo-600 truncate">{{ course.title }}</p>
                  <p class="ml-1 flex-shrink-0 font-normal text-gray-500">in {{ course.category }}</p>
                </div>
                <div class="mt-2 flex">
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-1.5 h-5 w-5 text-gray-400">📅</span>
                    Created on {{ new Date(course.createdAt).toLocaleDateString() }}
                  </div>
                </div>
              </div>
              <div class="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                <div class="flex -space-x-1 overflow-hidden">
                   <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ course.published ? 'Published' : 'Draft' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="ml-5 flex-shrink-0">
               <button class="text-gray-400 hover:text-gray-500">
                 <span class="sr-only">Edit</span>
                 ⚙️
               </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="!instructorCourses.length" class="p-12 text-center text-gray-500 italic">
        You haven't created any courses yet.
      </div>
    </div>

    <!-- Create Course Modal (Simplified) -->
    <div v-if="showCreateModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create New Course</h3>
            <div class="mt-4 space-y-4">
              <input v-model="newCourse.title" type="text" placeholder="Course Title" class="block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <textarea v-model="newCourse.description" placeholder="Description" rows="3" class="block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              <input v-model="newCourse.category" type="text" placeholder="Category" class="block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button @click="handleCreateCourse" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:col-start-2 sm:text-sm">
              Create
            </button>
            <button @click="showCreateModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: allCourses, refresh } = await useFetch<any>('/api/courses')
const { data: userStats } = await useFetch<any>('/api/stats/summary')
const { data: authData } = useAuth()

const instructorCourses = computed(() => {
  return allCourses.value?.filter((c: any) => c.instructorId === (authData.value?.user as any)?.id) || []
})

const stats = computed(() => ({
  'My Courses': instructorCourses.value.length,
  'Total Students': instructorCourses.value.reduce((acc: number, c: any) => acc + (c._count?.enrollments || 0), 0),
  'Avg. Rating': '4.8' // Mocked field
}))

const showCreateModal = ref(false)
const newCourse = ref({
  title: '',
  description: '',
  category: ''
})

async function handleCreateCourse() {
  try {
    await $fetch('/api/courses', {
      method: 'POST',
      body: newCourse.value
    })
    showCreateModal.value = false
    newCourse.value = { title: '', description: '', category: '' }
    refresh()
  } catch (err) {
    console.error(err)
    alert('Failed to create course')
  }
}

definePageMeta({
  middleware: 'auth'
})
</script>
