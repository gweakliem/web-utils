<template>
  <div class="qr-generator">
    <h1 class="text-2xl font-bold mb-4">QR Code Generator</h1>
    
    <div class="mb-4">
      <input
        v-model="text"
        type="text"
        placeholder="Enter text or URL"
        class="w-full p-2 border rounded"
      />
    </div>

    <div v-if="text" class="qr-display flex flex-col items-center">
      <QRCodeVue3
        :key="qrValue"
        :value="qrValue"
        :size="size"
        :level="level"
        render-as="svg"
        class="mb-4"
      />
      <div class="controls space-y-2">
        <div class="flex items-center space-x-2">
          <label>Size:</label>
          <input
            v-model.number="size"
            type="range"
            min="100"
            max="400"
            step="50"
            class="w-48"
          />
          <span>{{ size }}px</span>
        </div>
        <div class="flex items-center space-x-2">
          <label>Error Level:</label>
          <select v-model="level" class="p-1 border rounded">
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="Q">Quartile</option>
            <option value="H">High</option>
          </select>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-4">
      Enter text above to generate QR code
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QRCodeVue3 from 'qrcode-vue3'

const text = ref('')
const size = ref(200)
const level = ref('M')

const qrValue = computed(() => text.value)
</script>

<style scoped>
.qr-generator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  width: 100%;
  max-width: 300px;
}
</style>
