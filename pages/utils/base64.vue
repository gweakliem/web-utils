<!-- pages/utils/base64.vue -->
<template>
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Base64 Encoder/Decoder</h2>
      <div class="space-y-4">
        <textarea
          v-model="input"
          class="w-full p-2 border rounded"
          rows="4"
          placeholder="Enter text to encode/decode"
        ></textarea>
        <div class="flex space-x-4">
          <button
            @click="encode"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Encode
          </button>
          <button
            @click="decode"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Decode
          </button>
        </div>
        <div v-if="output" class="border-2 border-gray-300 rounded-lg p-4 bg-white">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">Result:</h3>
            <button
              @click="copyToClipboard"
              class="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              <Icon name="mdi:content-copy" class="w-4 h-4 mr-1" />
              Copy
            </button>
          </div>
          <p class="font-mono break-all">{{ output }}</p>
        </div>
        <div v-if="copySuccess" class="text-green-600 text-sm">
          Copied to clipboard!
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const input = ref('')
  const output = ref('')
  const copySuccess = ref(false)
  
  const encode = () => {
    try {
      output.value = btoa(input.value)
    } catch (e) {
      output.value = 'Error: Invalid input for encoding'
    }
  }
  
  const decode = () => {
    try {
      output.value = atob(input.value)
    } catch (e) {
      output.value = 'Error: Invalid base64 string'
    }
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output.value)
      copySuccess.value = true
      // Hide success message after 2 seconds
      setTimeout(() => {
        copySuccess.value = false
      }, 2000)
    } catch (e) {
      console.error('Failed to copy text:', e)
    }
  }
  </script>