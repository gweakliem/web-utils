<!-- pages/utils/colors.vue -->
<template>
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Color Palette Generator</h2>
      
      <div class="space-y-6">
        <!-- Color Input Section -->
        <div class="bg-white p-6 rounded-lg border-2 border-gray-300">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium mb-2">Base Color</label>
              <div class="flex gap-2">
                <input 
                  type="color" 
                  v-model="baseColor"
                  class="h-10 w-20"
                  @input="generatePalette"
                >
                <input 
                  type="text" 
                  v-model="baseColor"
                  class="flex-1 px-3 py-2 border rounded"
                  placeholder="#000000"
                  @input="generatePalette"
                >
              </div>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium mb-2">Harmony Type</label>
              <select 
                v-model="harmonyType"
                class="w-full px-3 py-2 border rounded"
                @change="generatePalette"
              >
                <option value="analogous">Analogous</option>
                <option value="monochromatic">Monochromatic</option>
                <option value="triadic">Triadic</option>
                <option value="complementary">Complementary</option>
                <option value="split-complementary">Split Complementary</option>
                <option value="tetradic">Tetradic</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Generated Palette -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Generated Palette</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="(color, index) in palette" 
              :key="index"
              class="bg-white rounded-lg border-2 border-gray-300 overflow-hidden"
            >
              <div 
                :style="{ backgroundColor: color }"
                class="h-32 relative"
              >
                <button
                  @click="copyColor(color)"
                  class="absolute bottom-2 right-2 bg-white/90 hover:bg-white px-3 py-1 rounded-full text-sm shadow-lg flex items-center gap-1"
                >
                  <Icon name="mdi:content-copy" class="w-4 h-4" />
                  Copy
                </button>
              </div>
                <div class="p-3 space-y-2">
                <div class="flex justify-between items-center">
                    <span class="font-mono text-sm">{{ color.toUpperCase() }}</span>
                    <span class="text-sm text-gray-500">{{ colorTypes[index] }}</span>
                </div>
                <div class="flex flex-col gap-1 text-sm text-gray-500">
                    <div class="flex items-center gap-2">
                    <span>RGB: {{ hexToRgb(color) }}</span>
                    <div class="flex gap-1">
                        <span 
                        class="w-4 h-4 rounded-sm border border-gray-200"
                        :style="{ backgroundColor: `rgb(${getRgbComponents(color).r}, 0, 0)` }"
                        :title="`R: ${getRgbComponents(color).r}`"
                        ></span>
                        <span 
                        class="w-4 h-4 rounded-sm border border-gray-200"
                        :style="{ backgroundColor: `rgb(0, ${getRgbComponents(color).g}, 0)` }"
                        :title="`G: ${getRgbComponents(color).g}`"
                        ></span>
                        <span 
                        class="w-4 h-4 rounded-sm border border-gray-200"
                        :style="{ backgroundColor: `rgb(0, 0, ${getRgbComponents(color).b})` }"
                        :title="`B: ${getRgbComponents(color).b}`"
                        ></span>
                    </div>
                    </div>
                    <span>HSL: {{ hexToHsl(color) }}</span>
                </div>
                </div>
            </div>
          </div>
        </div>
  
        <!-- Success message for copy -->
        <div 
          v-if="showCopySuccess" 
          class="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg shadow-lg"
        >
          Color copied to clipboard!
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const baseColor = ref('#4A90E2')
  const harmonyType = ref('analogous')
  const palette = ref([])
  const showCopySuccess = ref(false)
  const colorTypes = ref([])
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
  }
  
  // Convert hex to HSL
  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255
  
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
  
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
  
    return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
  }
  
  // Convert HSL to Hex
  const hslToHex = (h, s, l) => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = n => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }
  
  // Generate color palette based on harmony type
  const generatePalette = () => {
    const hsl = hexToHsl(baseColor.value).split(',').map(val => parseFloat(val))
    const h = hsl[0]
    const s = hsl[1]
    const l = hsl[2]
  
    switch (harmonyType.value) {
      case 'analogous':
        palette.value = [
          baseColor.value,
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h + 60) % 360, s, l),
          hslToHex((h - 30 + 360) % 360, s, l),
          hslToHex((h - 60 + 360) % 360, s, l)
        ]
        colorTypes.value = ['Base', '+30°', '+60°', '-30°', '-60°']
        break
        
      case 'monochromatic':
        palette.value = [
          baseColor.value,
          hslToHex(h, s, Math.max(0, l - 30)),
          hslToHex(h, s, Math.min(100, l + 30)),
          hslToHex(h, Math.max(0, s - 30), l),
          hslToHex(h, Math.min(100, s + 30), l)
        ]
        colorTypes.value = ['Base', 'Darker', 'Lighter', 'Desaturated', 'Saturated']
        break
  
      case 'triadic':
        palette.value = [
          baseColor.value,
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l)
        ]
        colorTypes.value = ['Base', '+120°', '+240°']
        break
  
      case 'complementary':
        palette.value = [
          baseColor.value,
          hslToHex((h + 180) % 360, s, l)
        ]
        colorTypes.value = ['Base', 'Complement']
        break
  
      case 'split-complementary':
        palette.value = [
          baseColor.value,
          hslToHex((h + 150) % 360, s, l),
          hslToHex((h + 210) % 360, s, l)
        ]
        colorTypes.value = ['Base', '+150°', '+210°']
        break
  
      case 'tetradic':
        palette.value = [
          baseColor.value,
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l)
        ]
        colorTypes.value = ['Base', '+90°', '+180°', '+270°']
        break
    }
  }
  
  // Copy color to clipboard
  const copyColor = async (color) => {
    try {
      await navigator.clipboard.writeText(color)
      showCopySuccess.value = true
      setTimeout(() => {
        showCopySuccess.value = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy color:', err)
    }
  }

  const getRgbComponents = (hex) => {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    }
  }
  
  // Generate initial palette
  onMounted(() => {
    generatePalette()
  })
  </script>