<!-- layouts/default.vue -->
<template>
    <div class="flex h-screen bg-gray-100">
      <Sidebar />
      <main class="flex-1 p-8 overflow-auto">
        <slot />
      </main>
    </div>
  </template>