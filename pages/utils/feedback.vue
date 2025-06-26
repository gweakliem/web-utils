<template>
  <div class="feedback-form max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Submit Feedback</h1>
    
    <div>
      <p class="text-sm text-gray-600">We value your feedback!</p>
      <p class="mb-2">Issues are tracked on <a href="https://github.com/gweakliem/web-utils/issues" class="text-blue-600 hover:underline">GitHub:</a></p>
    </div>
    <form @submit.prevent="submitFeedback" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium mb-1">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          required
          placeholder="Brief description of your feedback"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label for="type" class="block text-sm font-medium mb-1">Type</label>
        <select
          id="type"
          v-model="type"
          required
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="improvement">Improvement</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          v-model="description"
          required
          rows="5"
          placeholder="Please provide detailed information about your feedback"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div v-if="error" class="text-red-500 text-sm mt-2">
        {{ error }}
      </div>

      <div v-if="success" class="text-green-500 text-sm mt-2">
        {{ success }}
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const config = useRuntimeConfig()
const title = ref('')
const type = ref('bug')
const description = ref('')
const error = ref('')
const success = ref('')
const isSubmitting = ref(false)

// Sanitize text to prevent @ mentions that could trigger automation
const sanitizeText = (text: string): string => {
  // Remove @ mentions by replacing @username with [username]
  return text.replace(/@([a-zA-Z0-9_-]+)/g, '[$1]')
}

const submitFeedback = async () => {
  error.value = ''
  success.value = ''
  isSubmitting.value = true

  try {
    // Sanitize title and description to prevent @ mentions
    const sanitizedTitle = sanitizeText(title.value)
    const sanitizedDescription = sanitizeText(description.value)

    // GitHub API requires authentication
    const response = await fetch('https://api.github.com/repos/gweakliem/web-utils/issues', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${config.public.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[${type.value.toUpperCase()}] ${sanitizedTitle}`,
        body: sanitizedDescription,
        labels: [type.value]
      })
    })

    if (!response.ok) {
      const responseData = await response.json()
      console.log('failed to submit feeback', response.statusText)
      console.log(responseData.message)
      throw new Error(responseData.message || 'Failed to submit feedback. Please try again later.')
    }

    success.value = 'Feedback submitted successfully! Thank you for your input.'
    // Reset form
    title.value = ''
    description.value = ''
    type.value = 'bug'
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}
</script>
