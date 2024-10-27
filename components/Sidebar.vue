<!-- components/Sidebar.vue -->
<template>
    <aside class="w-64 bg-white shadow-lg">
      <div class="p-4">
        <h1 class="text-xl font-bold">Web Utilities</h1>
      </div>
      <nav class="mt-4">
        <ul>
          <li v-for="util in utilities" :key="util.id">
            <NuxtLink 
              :to="util.path"
              class="flex items-center px-4 py-2 hover:bg-gray-100"
              :title="util.description"
            >
              <Icon :name="util.icon" class="w-6 h-6 mr-2" />
              <span>{{ util.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script setup>
  const { utilities } = useUtilities()
  </script>