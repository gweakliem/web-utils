<!-- pages/index.vue -->
<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Welcome to meggie.be!</h1>
    <p class="mb-4">
      Meggie.be provides a collection of useful web-based utilities:
    </p>
    <ul class="list-disc pl-6 space-y-2">
      <li v-for="util in utilities" :key="util.id">
        <NuxtLink :to="util.path" class="text-blue-600 hover:underline">
          {{ util.name }}
        </NuxtLink>
        - {{ util.description }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const { utilities } = useUtilities()
</script>