<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Messages</h1>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="message in messages" :key="message.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <span class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {{ message.senderId === (data?.user as any)?.id ? 'TO' : 'FROM' }}
                </span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">
                   {{ message.senderId === (data?.user as any)?.id ? 'To: ' + message.receiver.name : message.sender.name }}
                </p>
                <p class="text-sm text-gray-500 italic">{{ message.content }}</p>
              </div>
            </div>
            <div class="text-xs text-gray-400">
              {{ new Date(message.createdAt).toLocaleString() }}
            </div>
          </div>
        </li>
      </ul>
      
      <div v-if="!messages?.length" class="p-8 text-center text-gray-500">
        No messages yet.
      </div>
    </div>
    
    <!-- New Message Form -->
    <div class="mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-inner">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Send a New Message</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 italic">Recipient ID (User ID)</label>
          <input v-model="recipientId" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 italic">Message</label>
          <textarea v-model="content" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        <button @click="sendMessage" class="px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors">
          Send Message
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: messages, refresh } = await useFetch<any>('/api/messages')
const { data } = useAuth()

const recipientId = ref('')
const content = ref('')

async function sendMessage() {
  try {
    await $fetch('/api/messages/send', {
      method: 'POST',
      body: {
        receiverId: recipientId.value,
        content: content.value
      }
    })
    recipientId.value = ''
    content.value = ''
    refresh()
    alert('Message sent successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to send message.')
  }
}
</script>
