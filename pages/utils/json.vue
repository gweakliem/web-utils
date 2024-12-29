<!-- pages/utils/json.vue -->
<template>
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">JSON Tools</h2>
      
      <div class="space-y-4">
        <div class="relative">
          <!-- The actual textarea for input -->
          <textarea
            v-model="jsonInput"
            @scroll="syncScroll"
            @input="handleInput"
            class="absolute w-full h-96 p-4 font-mono text-sm border-2 rounded-lg resize-none bg-transparent text-transparent caret-black"
            :class="{
              'border-red-500': hasError,
              'border-gray-300': !hasError
            }"
            spellcheck="false"
          ></textarea>
  
          <!-- Highlighting overlay -->
          <pre
            ref="highlightOverlay"
            class="w-full h-96 p-4 font-mono text-sm rounded-lg overflow-auto whitespace-pre-wrap break-words pointer-events-none"
            aria-hidden="true"
          ><template v-for="(part, index) in highlightedParts" :key="index"><span 
              :class="{
                'bg-red-200': part.type === 'error',
                'text-gray-900': part.type === 'normal'
              }"
              :data-error="part.type === 'error' ? errorMessage : ''"
            >{{ part.text }}</span></template><template v-if="!jsonInput">Paste your JSON here...</template></pre>
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
  
        <!-- Error message -->
        <div 
          v-if="hasError" 
          class="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"
        >
          {{ errorMessage }} (Line: {{ errorLocation.line }}, Column: {{ errorLocation.column }})
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
  const errorLocation = ref({ line: 0, column: 0 })
  const highlightOverlay = ref(null)
  const highlightedParts = ref([])
  
  const syncScroll = (e) => {
    if (highlightOverlay.value) {
      highlightOverlay.value.scrollTop = e.target.scrollTop
      highlightOverlay.value.scrollLeft = e.target.scrollLeft
    }
  }
  
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
  
  const handleInput = () => {
    hasError.value = false
    errorMessage.value = ''
    showSuccess.value = false
    errorLocation.value = { line: 0, column: 0 }
    updateHighlighting(null)
  }
  
  const updateHighlighting = (location) => {
  if (!location || !jsonInput.value) {
    highlightedParts.value = [{ type: 'normal', text: jsonInput.value }]
    return
  }

  const lines = jsonInput.value.split('\n')
  const errorLine = location.line - 1
  const errorColumn = location.column

  const parts = []
  
  // Add lines before error
  if (errorLine > 0) {
    parts.push({
      type: 'normal',
      text: lines.slice(0, errorLine).join('\n') + '\n'
    })
  }
  
  // Add error line with highlighting
  const line = lines[errorLine]
  if (line) {
    const beforeError = line.slice(0, Math.max(0, errorColumn - 1))
    const errorChar = line.slice(errorColumn - 1, errorColumn)
    const afterError = line.slice(errorColumn)
    
    if (beforeError) {
      parts.push({ type: 'normal', text: beforeError })
    }
    parts.push({ type: 'error', text: errorChar })
    if (afterError) {
      parts.push({ type: 'normal', text: afterError })
    }
  }
  
  // Add lines after error
  if (errorLine < lines.length - 1) {
    parts.push({
      type: 'normal',
      text: '\n' + lines.slice(errorLine + 1).join('\n')
    })
  }
  
  highlightedParts.value = parts
}

  const validateJSON = () => {
    try {
      if (!jsonInput.value.trim()) {
        throw new Error('Please enter some JSON to validate')
      }
      
      JSON.parse(jsonInput.value)
      hasError.value = false
      errorMessage.value = ''
      showSuccess.value = true
      errorLocation.value = { line: 0, column: 0 }
      updateHighlighting(null)
      
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } catch (e) {
      hasError.value = true
      errorMessage.value = e.message
      errorLocation.value = parseErrorPosition(e)
      updateHighlighting(errorLocation.value)
    }
  }
  
  const formatJSON = () => {
    try {
      if (!jsonInput.value.trim()) {
        throw new Error('Please enter some JSON to format')
      }
  
      const parsed = JSON.parse(jsonInput.value)
      jsonInput.value = JSON.stringify(parsed, null, 2)
      hasError.value = false
      errorMessage.value = ''
      showSuccess.value = true
      errorLocation.value = { line: 0, column: 0 }
      updateHighlighting(null)
    } catch (e) {
      hasError.value = true
      errorMessage.value = e.message
      errorLocation.value = parseErrorPosition(e)
      updateHighlighting(errorLocation.value)
    }
  }
  
  // Initialize highlighting
  onMounted(() => {
    updateHighlighting(null)
  })
  </script>
  
  <style scoped>
  /* Make textarea and overlay use the same font sizing */
  textarea, pre {
    font-size: 14px;
    line-height: 1.5;
  }
  
  /* Style the error highlights */
  [data-error] {
    position: relative;
  }
  
  [data-error]:hover::after {
    content: attr(data-error);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem;
    background: #FEE2E2;
    border: 1px solid #FCA5A5;
    border-radius: 0.375rem;
    white-space: nowrap;
    font-size: 0.875rem;
    color: #B91C1C;
    z-index: 10;
    pointer-events: none;
  }
  </style>
