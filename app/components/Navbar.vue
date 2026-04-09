<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Sentinel Hub",
    icon: "i-lucide-satellite-dish",
    to: "https://www.sentinel-hub.com/",
    target: "_blank",
  },
  {
    label: "GitHub",
    icon: "i-lucide-github",
    to: "https://github.com/Talkird/sentinelhub-api-tester",
    target: "_blank",
  },
]);
</script>

<template>
  <UHeader mode="drawer">
    <template #title>
      <h1 class="text-lg font-bold">Sentinel Hub API Tester</h1>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
