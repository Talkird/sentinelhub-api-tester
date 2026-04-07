<script setup lang="ts">
import type { Image } from "~/server/types";

const props = defineProps<Image>();
</script>

<template>
  <UCard>
    <img
      :src="props.url"
      :alt="`Satellite image ${props.id}`"
      class="w-full h-64 object-cover rounded mb-4"
    />
    <div>
      <p class="font-mono text-sm mb-2">
        {{ props.filename }}
      </p>
      <p class="text-xs mb-1">{{ props.date }}</p>
      <p class="text-xs">{{ (props.size / 1024).toFixed(2) }} KB</p>
    </div>
  </UCard>
</template>
