<!-- pages/utils/pdf-extract.vue -->
<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">PDF Text Extractor</h2>
    <div class="space-y-4">
      <!-- File Upload Area -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <input
          ref="fileInput"
          type="file"
          accept=".pdf"
          @change="handleFileSelect"
          class="hidden"
        />
        <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
          <Icon name="mdi:file-pdf-box" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p class="text-lg font-medium text-gray-600 mb-2">Click to upload a PDF file</p>
          <p class="text-sm text-gray-500">Or drag and drop a PDF file here</p>
          <p class="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
        </div>
        <div v-else class="space-y-2">
          <Icon name="mdi:file-pdf-box" class="w-12 h-12 mx-auto text-red-500" />
          <p class="font-medium">{{ selectedFile.name }}</p>
          <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
          <button
            @click="clearFile"
            class="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Remove
          </button>
        </div>
      </div>

      <!-- Extract Button -->
      <button
        @click="extractText"
        :disabled="!selectedFile || loading"
        class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">
          <Icon name="mdi:loading" class="w-4 h-4 mr-2 animate-spin" />
          Extracting Text...
        </span>
        <span v-else>Extract Text</span>
      </button>

      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <!-- Output Area -->
      <div v-if="extractedText" class="border-2 border-gray-300 rounded-lg p-4 bg-white">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-bold">Extracted Text:</h3>
          <button
            @click="copyToClipboard"
            class="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            <Icon name="mdi:content-copy" class="w-4 h-4 mr-1" />
            Copy
          </button>
        </div>
        <textarea
          v-model="extractedText"
          class="w-full p-2 border rounded font-mono text-sm"
          rows="12"
          readonly
        ></textarea>
      </div>

      <!-- Copy Success Message -->
      <div v-if="copySuccess" class="text-green-600 text-sm">
        Copied to clipboard!
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedFile = ref(null)
const extractedText = ref('')
const loading = ref(false)
const error = ref('')
const copySuccess = ref(false)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      error.value = 'Please select a PDF file'
      return
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      error.value = 'File size must be less than 10MB'
      return
    }
    selectedFile.value = file
    error.value = ''
    extractedText.value = ''
  }
}

const clearFile = () => {
  selectedFile.value = null
  extractedText.value = ''
  error.value = ''
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const extractText = async () => {
  if (!selectedFile.value) return

  loading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('pdf', selectedFile.value)

    const response = await $fetch('/api/pdf-extract', {
      method: 'POST',
      body: formData
    })

    extractedText.value = response.text
  } catch (err) {
    console.error('PDF extraction error:', err)
    error.value = err.data?.message || 'Failed to extract text from PDF'
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(extractedText.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy text:', e)
  }
}
</script>