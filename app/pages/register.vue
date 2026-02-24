<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Nom complet</label>
            <input id="name" v-model="name" name="name" type="text" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Nom complet">
          </div>
          <div>
            <label for="email-address" class="sr-only">Adresse e-mail</label>
            <input id="email-address" v-model="email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Adresse e-mail">
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input id="password" v-model="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Mot de passe">
          </div>
          <div class="p-3 bg-white border border-gray-300 rounded-b-md">
            <label class="block text-sm font-medium text-gray-700 mb-2">Je suis un :</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="role" value="LEARNER" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                <span class="ml-2 text-sm text-gray-700">Étudiant</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="role" value="INSTRUCTOR" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                <span class="ml-2 text-sm text-gray-700">Instructeur</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {{ loading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Vous avez déjà un compte ? 
            <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Connectez-vous ici
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const name = ref('')
const role = ref('LEARNER')
const loading = ref(false)
const error = ref('')
const { signIn } = useAuth()
const route = useRoute()

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        name: name.value,
        role: role.value
      }
    })
    
    // Auto login after registration
    const callbackUrl = (route.query.callbackUrl as string) || '/'
    await signIn('credentials', {
      email: email.value,
      password: password.value,
      callbackUrl
    })
  } catch (err: any) {
    console.error('Registration failed:', err)
    error.value = err.data?.statusMessage || "L'inscription a échoué. Veuillez réessayer."
  } finally {
    loading.value = false
  }
}

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})
</script>
