<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Unix Epoch Converter</h1>
      
      <div class="grid gap-6">
        <!-- Unix Timestamp Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Unix Timestamp</span>
          </label>
          <div class="flex gap-4">
            <input
              type="number"
              v-model="timestamp"
              class="input input-bordered flex-1"
              placeholder="Enter Unix timestamp..."
              @input="updateFromTimestamp"
            />
            <select 
              v-model="timestampFormat" 
              class="select select-bordered w-48"
              @change="handleFormatChange"
            >
              <option value="seconds">Seconds</option>
              <option value="milliseconds">Milliseconds</option>
              <option value="microseconds">Microseconds</option>
              <option value="nanoseconds">Nanoseconds</option>
            </select>
          </div>
        </div>

        <!-- Time Adjustment Controls -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Adjust Time</span>
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <!-- Seconds -->
            <div class="flex flex-col gap-1">
              <div class="flex gap-1">
                <button @click="adjustTime(-1, 'seconds')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-down-bold" style="color: black" aria-label="-1"/>
                </button>
              <span class="text-xs text-center font-medium">Seconds</span>
                <button @click="adjustTime(1, 'seconds')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-up-bold" style="color: black" aria-label="+1"/>
                </button>
              </div>
            </div>
            <!-- Minutes -->
            <div class="flex flex-col gap-1">
              <div class="flex gap-1">
                <button @click="adjustTime(-1, 'minutes')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-down-bold" style="color: black"/>
                </button>
              <span class="text-xs text-center font-medium">Minutes</span>
                <button @click="adjustTime(1, 'minutes')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-up-bold" style="color: black" aria-label="+1"/>
                </button>
              </div>
            </div>
            <!-- Hours -->
            <div class="flex flex-col gap-1">
              <div class="flex gap-1">
                <button @click="adjustTime(-1, 'hours')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-down-bold" style="color: black" aria-label="-1"/>
                </button>
              <span class="text-xs text-center font-medium">Hours</span>
                <button @click="adjustTime(1, 'hours')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-up-bold" style="color: black" aria-label="+1"/>
                </button>
              </div>
            </div>
            <!-- Days -->
            <div class="flex flex-col gap-1">
              <div class="flex gap-1">
                <button @click="adjustTime(-1, 'days')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-down-bold" style="color: black" aria-label="-1"/>
                </button>
              <span class="text-xs text-center font-medium">Days</span>
                <button @click="adjustTime(1, 'days')" class="btn btn-sm btn-outline flex-1">
                  <Icon name="mdi:arrow-up-bold" style="color: black" aria-label="+1"/>
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Human Readable Date Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Human Readable Date</span>
          </label>
          <input
            type="datetime-local"
            v-model="dateTime"
            class="input input-bordered w-full"
            @input="updateFromDateTime"
          />
        </div>
  
        <!-- All Timestamp Formats -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">All Formats</span>
          </label>
          <div class="grid gap-2 text-sm p-4 bg-base-200 rounded-lg">
            <div class="grid grid-cols-2">
              <span class="font-semibold">Seconds:</span>
              <span>{{ allFormats.seconds }}</span>
            </div>
            <div class="grid grid-cols-2">
              <span class="font-semibold">Milliseconds:</span>
              <span>{{ allFormats.milliseconds }}</span>
            </div>
            <div class="grid grid-cols-2">
              <span class="font-semibold">Microseconds:</span>
              <span>{{ allFormats.microseconds }}</span>
            </div>
            <div class="grid grid-cols-2">
              <span class="font-semibold">Nanoseconds:</span>
              <span>{{ allFormats.nanoseconds }}</span>
            </div>
          </div>
        </div>
  
        <!-- Local Time Display -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Local Time</span>
          </label>
          <div class="text-lg p-4 bg-base-200 rounded-lg">
            {{ formattedLocalTime }}
          </div>
        </div>
  
        <!-- UTC Time Display -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">UTC Time</span>
          </label>
          <div class="text-lg p-4 bg-base-200 rounded-lg">
            {{ formattedUTCTime }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const timestamp = ref('')
  const dateTime = ref('')
  const timestampFormat = ref('seconds')
  
  // Initialize with current time
  const now = new Date()
  dateTime.value = now.toISOString().slice(0, 16)
  timestamp.value = Math.floor(now.getTime() / 1000).toString()
  
  const detectFormat = (value: string): string => {
    if (!value) return 'seconds'
    const num = parseFloat(value)
    const now = new Date().getTime()
    
    const maxEpoch = 2147483647; // 2^31-1, max representable seconds
    // Reasonable ranges for each format based on current time
    // A timestamp should be within ±50 years of current time
    const fiftyYearsMs = 50 * 365 * 24 * 60 * 60 * 1000
    const minTime = now - fiftyYearsMs
    const maxTime = now + fiftyYearsMs
    
    // Convert input to milliseconds for each format
    const asSeconds = num * 1000
    const asMilliseconds = num
    const asMicroseconds = num / 1000
    const asNanoseconds = num / 1000000
    
    // Check which conversion puts us in a reasonable time range
    if (asSeconds >= minTime && asSeconds <= maxEpoch) return 'seconds'
    if (asMilliseconds >= minTime && asMilliseconds <= maxTime) return 'milliseconds'
    if (asMicroseconds >= minTime && asMicroseconds <= maxTime) return 'microseconds'
    if (asNanoseconds >= minTime && asNanoseconds <= maxTime) return 'nanoseconds'
    
    // Default to seconds if we can't detect
    return 'seconds'
  }
  
  const getMillisecondsFromTimestamp = (value: string, format: string): number => {
    if (!value) return 0
    const num = parseFloat(value)
    switch (format) {
      case 'seconds':
        return num * 1000
      case 'milliseconds':
        return num
      case 'microseconds':
        return num / 1000
      case 'nanoseconds':
        return num / 1000000
      default:
        return num * 1000
    }
  }
  
  const convertTimestampToFormat = (ms: number, format: string): string => {
    switch (format) {
      case 'seconds':
        return Math.floor(ms / 1000).toString()
      case 'milliseconds':
        return ms.toString()
      case 'microseconds':
        return (ms * 1000).toString()
      case 'nanoseconds':
        return (ms * 1000000).toString()
      default:
        return Math.floor(ms / 1000).toString()
    }
  }
  
  const handleFormatChange = () => {
    if (timestamp.value) {
      // Get current time in milliseconds using old format
      const ms = getMillisecondsFromTimestamp(timestamp.value, timestampFormat.value)
      // Convert to new format
      timestamp.value = convertTimestampToFormat(ms, timestampFormat.value)
    }
  }

  const updateFromTimestamp = () => {
    if (timestamp.value) {
      // Auto-detect format when user types
      timestampFormat.value = detectFormat(timestamp.value)
      const ms = getMillisecondsFromTimestamp(timestamp.value, timestampFormat.value)
      const date = new Date(ms)
      dateTime.value = date.toISOString().slice(0, 16)
    }
  }
  
  const updateFromDateTime = () => {
    if (dateTime.value) {
      const date = new Date(dateTime.value)
      const ms = date.getTime()
      switch (timestampFormat.value) {
        case 'seconds':
          timestamp.value = Math.floor(ms / 1000).toString()
          break
        case 'milliseconds':
          timestamp.value = ms.toString()
          break
        case 'microseconds':
          timestamp.value = (ms * 1000).toString()
          break
        case 'nanoseconds':
          timestamp.value = (ms * 1000000).toString()
          break
      }
    }
  }

  const adjustTime = (amount: number, unit: 'seconds' | 'minutes' | 'hours' | 'days') => {
    if (!timestamp.value) return
    
    const ms = getMillisecondsFromTimestamp(timestamp.value, timestampFormat.value)
    const date = new Date(ms)
    
    switch (unit) {
      case 'seconds':
        date.setSeconds(date.getSeconds() + amount)
        break
      case 'minutes':
        date.setMinutes(date.getMinutes() + amount)
        break
      case 'hours':
        date.setHours(date.getHours() + amount)
        break
      case 'days':
        date.setDate(date.getDate() + amount)
        break
    }
    
    const newMs = date.getTime()
    timestamp.value = convertTimestampToFormat(newMs, timestampFormat.value)
    dateTime.value = date.toISOString().slice(0, 16)
  }
  
  const allFormats = computed(() => {
    if (!timestamp.value) {
      return {
        seconds: '-',
        milliseconds: '-',
        microseconds: '-',
        nanoseconds: '-'
      }
    }
    
    const ms = getMillisecondsFromTimestamp(timestamp.value, timestampFormat.value)
    return {
      seconds: Math.floor(ms / 1000).toString(),
      milliseconds: ms.toString(),
      microseconds: (ms * 1000).toString(),
      nanoseconds: (ms * 1000000).toString()
    }
  })
  
  const formattedLocalTime = computed(() => {
    if (!timestamp.value) return '-'
    const ms = getMillisecondsFromTimestamp(timestamp.value, timestampFormat.value)
    const date = new Date(ms)
    const timeString = date.toLocaleString()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return `${timeString} (${timezone})`
  })
  
  const formattedUTCTime = computed(() => {
    if (!timestamp.value) return '-'
    const ms = getMillisecondsFromTimestamp(timestamp.value, timestampFormat.value)
    return new Date(ms).toUTCString()
  })
  </script>