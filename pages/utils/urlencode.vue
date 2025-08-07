<template>
  <div class="url-encoder max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">URL Encoder/Decoder</h1>
    
    <div class="space-y-4">
      <div>
        <label for="plainText" class="block text-sm font-medium mb-2">Plain Text</label>
        <div class="relative">
          <button @click="copyPlainText"
            class="absolute top-2 right-2 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
            :title="copyPlainSuccess ? 'Copied!' : 'Copy to clipboard'">
            <Icon :name="copyPlainSuccess ? 'mdi:check' : 'mdi:content-copy'" class="w-5 h-5" />
          </button>
          <textarea
            id="plainText"
            v-model="plainText"
            @input="handlePlainTextInput"
            rows="4"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text to encode..."
          ></textarea>
        </div>
      </div>

      <div class="flex justify-center space-x-4">
        <button
          @click="encode"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ↓ Encode ↓
        </button>
        <button
          @click="decode"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ↑ Decode ↑
        </button>
      </div>

      <div>
        <label for="encodedText" class="block text-sm font-medium mb-2">Encoded Text</label>
        <div class="relative">
          <button @click="copyEncodedText"
            class="absolute top-2 right-2 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
            :title="copyEncodedSuccess ? 'Copied!' : 'Copy to clipboard'">
            <Icon :name="copyEncodedSuccess ? 'mdi:check' : 'mdi:content-copy'" class="w-5 h-5" />
          </button>
          <textarea
            id="encodedText"
            v-model="encodedText"
            @input="handleEncodedTextInput"
            rows="4"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text to decode..."
          ></textarea>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h2 class="text-lg font-semibold mb-2">Options</h2>
      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="encodeSpaceAsPlus"
            class="mr-2"
            @change="handleOptionsChange"
          />
          <span class="text-sm">Encode spaces as + instead of %20</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const plainText = ref('')
const encodedText = ref('')
const encodeSpaceAsPlus = ref(false)
const copyPlainSuccess = ref(false)
const copyEncodedSuccess = ref(false)
let isUpdating = false

const encode = (text: string = plainText.value) => {
  if (encodeSpaceAsPlus.value) {
    return encodeURIComponent(text).replace(/%20/g, '+')
  }
  return encodeURIComponent(text)
}

const decode = (text: string = encodedText.value) => {
  if (encodeSpaceAsPlus.value) {
    return decodeURIComponent(text.replace(/\+/g, ' '))
  }
  return decodeURIComponent(text)
}

const handlePlainTextInput = () => {
  if (isUpdating) return
  isUpdating = true
  try {
    encodedText.value = encode()
  } catch (error) {
    console.error('Encoding error:', error)
  }
  isUpdating = false
}

const handleEncodedTextInput = () => {
  if (isUpdating) return
  isUpdating = true
  try {
    plainText.value = decode()
  } catch (error) {
    console.error('Decoding error:', error)
  }
  isUpdating = false
}

const handleOptionsChange = () => {
  handlePlainTextInput()
}

const copyPlainText = async () => {
  try {
    await navigator.clipboard.writeText(plainText.value)
    copyPlainSuccess.value = true
    setTimeout(() => {
      copyPlainSuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}

const copyEncodedText = async () => {
  try {
    await navigator.clipboard.writeText(encodedText.value)
    copyEncodedSuccess.value = true
    setTimeout(() => {
      copyEncodedSuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}

// Watch for changes in both text fields
watch(plainText, handlePlainTextInput)
watch(encodedText, handleEncodedTextInput)
</script>
