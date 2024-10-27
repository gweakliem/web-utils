<!-- pages/utils/json.vue -->
<template>
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">JSON Tools</h2>
      
      <div class="space-y-4">
        <div class="relative">
          <!-- Use a hidden textarea for the actual input -->
          <textarea
            v-model="jsonInput"
            class="w-full p-4 font-mono text-sm border-2 rounded-lg h-96 opacity-0 absolute"
            @input="handleInput"
          ></textarea>
          
          <!-- Display div with highlighting -->
          <pre
            ref="displayArea"
            class="w-full p-4 font-mono text-sm border-2 rounded-lg h-96 overflow-auto whitespace-pre-wrap break-all"
            :class="{
              'border-red-500': hasError,
              'border-gray-300': !hasError
            }"
          ><template v-if="jsonInput">{{ preErrorText }}<span 
              v-if="hasError" 
              class="bg-red-200 relative cursor-help"
              @mouseenter="showTooltip = true"
              @mouseleave="showTooltip = false"
            >{{ errorSection }}<span 
              v-if="showTooltip"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm whitespace-normal z-10 min-w-[200px] text-center"
            >{{ errorMessage }}</span></span>{{ postErrorText }}</template><template v-else>Paste your JSON here...</template></pre>
        </div>
  
        <div class="flex space-x-4">
          <button
            @click="validateJSON"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Icon name="mdi:check-circle" class="w-5 h-5 mr-2" />
            Validate
          </button>
          <button
            @click="formatJSON"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          >
            <Icon name="mdi:format-align-left" class="w-5 h-5 mr-2" />
            Format
          </button>
        </div>
  
        <!-- Success message -->
        <div 
          v-if="showSuccess" 
          class="p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm"
        >
          JSON is valid!
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const jsonInput = ref('')
  const hasError = ref(false)
  const errorMessage = ref('')
  const showSuccess = ref(false)
  const showTooltip = ref(false)
  const errorPosition = ref(null)
  const preErrorText = ref('')
  const postErrorText = ref('')
  const errorSection = ref('')
  const displayArea = ref(null)
  
  const parseErrorPosition = (error) => {
    const lines = jsonInput.value.split('\n')
    const absolutePosition = error.message.match(/line (\d+) column (\d+)/) || 
                            error.message.match(/at line (\d+) column (\d+)/) ||
                            error.message.match(/at line (\d+) column (\d+)/)
    
    if (absolutePosition) {
        const line = parseInt(absolutePosition[1])
        const col = parseInt(absolutePosition[2])
        return {
        line: line,
        column: col
        }
    }
    
    return { line: 0, column: 0 }
  }
  
  const highlightError = (position) => {
    if (position === null || !jsonInput.value) return
  
    // Get 10 characters before and after the error position
    const start = Math.max(0, position - 10)
    const end = Math.min(jsonInput.value.length, position + 10)
  
    preErrorText.value = jsonInput.value.substring(0, start)
    errorSection.value = jsonInput.value.substring(start, end)
    postErrorText.value = jsonInput.value.substring(end)
  }
  
  const handleInput = (event) => {
    // Clear error states when input changes
    hasError.value = false
    errorMessage.value = ''
    showSuccess.value = false
    errorPosition.value = null
  }
  
  const validateJSON = () => {
    try {
      // Clear previous states
      hasError.value = false
      errorMessage.value = ''
      showSuccess.value = false
      errorPosition.value = null
  
      // Try to parse the JSON
      if (!jsonInput.value.trim()) {
        throw new Error('Please enter some JSON to validate')
      }
      
      JSON.parse(jsonInput.value)
      
      // If we get here, JSON is valid
      showSuccess.value = true
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } catch (e) {
      hasError.value = true
      errorMessage.value = e.message
      errorPosition.value = parseErrorPosition(e)
      highlightError(errorPosition.value)
    }
  }
  
  const formatJSON = () => {
    try {
      // Clear previous states
      hasError.value = false
      errorMessage.value = ''
      showSuccess.value = false
      errorPosition.value = null
  
      if (!jsonInput.value.trim()) {
        throw new Error('Please enter some JSON to format')
      }
  
      // Parse and stringify with pretty printing
      const parsed = JSON.parse(jsonInput.value)
      jsonInput.value = JSON.stringify(parsed, null, 2)
    } catch (e) {
      hasError.value = true
      errorMessage.value = e.message
      errorPosition.value = parseErrorPosition(e)
      highlightError(errorPosition.value)
    }
  }
  
  // Sync scroll position between hidden textarea and display div
  onMounted(() => {
    const textarea = document.querySelector('textarea')
    const pre = displayArea.value
  
    textarea.addEventListener('scroll', () => {
      pre.scrollTop = textarea.scrollTop
      pre.scrollLeft = textarea.scrollLeft
    })
  
    pre.addEventListener('scroll', () => {
      textarea.scrollTop = pre.scrollTop
      textarea.scrollLeft = pre.scrollLeft
    })
  })
  </script>