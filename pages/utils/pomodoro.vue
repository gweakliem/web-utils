// pages/utils/pomodoro.vue
<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Pomodoro Timer</h2>
    
    <!-- Timer Display -->
    <div class="text-center mb-8">
      <div class="text-6xl font-mono mb-4">
        {{ formatTime(timeRemaining) }}
      </div>
      <div class="text-lg font-medium mb-2">
        {{ currentMode }}
      </div>
      <div class="text-sm text-gray-600 mb-4">
        Pomodoro #{{ currentPomodoro }}/4
      </div>
    </div>

    <!-- Controls -->
    <div class="flex justify-center space-x-4 mb-8">
      <button
        @click="toggleTimer"
        class="px-6 py-2 rounded-lg text-white font-medium"
        :class="isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
      >
        {{ isRunning ? 'Pause' : 'Start' }}
      </button>
      <button
        @click="resetTimer"
        class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
        :disabled="isRunning"
        :class="{ 'opacity-50 cursor-not-allowed': isRunning }"
      >
        Reset
      </button>
    </div>

    <!-- Settings -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium mb-4">Settings</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Work Duration (minutes)
          </label>
          <input
            v-model="settings.workDuration"
            type="number"
            min="1"
            max="60"
            class="w-full px-3 py-2 border rounded-md"
            :disabled="isRunning"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Break Duration (minutes)
          </label>
          <input
            v-model="settings.breakDuration"
            type="number"
            min="1"
            max="30"
            class="w-full px-3 py-2 border rounded-md"
            :disabled="isRunning"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Long Break Duration (minutes)
          </label>
          <input
            v-model="settings.longBreakDuration"
            type="number"
            min="1"
            max="45"
            class="w-full px-3 py-2 border rounded-md"
            :disabled="isRunning"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

// Timer settings
const settings = ref({
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15
})

// Timer state
const isRunning = ref(false)
const timeRemaining = ref(settings.value.workDuration * 60)
const currentPomodoro = ref(1)
const isBreak = ref(false)
let timerInterval = null

// Computed properties
const currentMode = computed(() => {
  if (isBreak.value) {
    return currentPomodoro.value % 4 === 0 ? 'Long Break' : 'Short Break'
  }
  return 'Work Time'
})

// Timer functions
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval)
  } else {
    timerInterval = setInterval(updateTimer, 1000)
  }
  isRunning.value = !isRunning.value
}

const updateTimer = () => {
  if (timeRemaining.value > 0) {
    timeRemaining.value--
  } else {
    notifyTimerComplete()
    if (isBreak.value) {
      if (currentPomodoro.value % 4 === 0) {
        currentPomodoro.value = 1
      } else {
        currentPomodoro.value++
      }
      isBreak.value = false
      timeRemaining.value = settings.value.workDuration * 60
    } else {
      isBreak.value = true
      timeRemaining.value = currentPomodoro.value % 4 === 0 
        ? settings.value.longBreakDuration * 60 
        : settings.value.breakDuration * 60
    }
  }
}

const resetTimer = () => {
  clearInterval(timerInterval)
  isRunning.value = false
  isBreak.value = false
  currentPomodoro.value = 1
  timeRemaining.value = settings.value.workDuration * 60
}

const notifyTimerComplete = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro Timer', {
      body: isBreak.value ? 'Time to work!' : 'Time for a break!',
      icon: '/favicon.ico'
    })
  }
  
  // Play sound
  const audio = new Audio('/notification.mp3')
  audio.play().catch(() => {
    // Handle cases where audio playback fails
    console.log('Audio playback failed')
  })
}

// Request notification permissions
onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

// Cleanup
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>