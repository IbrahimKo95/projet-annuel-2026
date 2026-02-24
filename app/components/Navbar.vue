<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="flex-shrink-0 flex items-center text-2xl font-bold text-indigo-600">
            LMS Platform
          </NuxtLink>
          <div class="hidden sm:flex sm:space-x-4">
            <NuxtLink to="/" class="text-sm font-medium text-gray-500 hover:text-gray-700">Accueil</NuxtLink>
            <NuxtLink v-if="status === 'authenticated'" to="/messages" class="text-sm font-medium text-gray-500 hover:text-gray-700">Messages</NuxtLink>
            <NuxtLink v-if="data?.user?.role === 'INSTRUCTOR' || data?.user?.role === 'ADMIN'" to="/instructor" class="text-sm font-medium text-gray-500 hover:text-gray-700">Instructeur</NuxtLink>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <template v-if="status === 'authenticated' && data?.user">
            <span class="text-sm text-gray-700">Bonjour, {{ data.user.name || data.user.email }}</span>
            <button @click="signOut()" class="text-sm font-medium text-gray-500 hover:text-gray-700">
              Déconnexion
            </button>
          </template>
          <template v-else>
            <NuxtLink :to="`/login?callbackUrl=${route.path}`" class="text-sm font-medium text-gray-500 hover:text-gray-700">
              Connexion
            </NuxtLink>
            <NuxtLink :to="`/register?callbackUrl=${route.path}`" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              S'inscrire
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { status, data, signOut } = useAuth()
const route = useRoute()
</script>
