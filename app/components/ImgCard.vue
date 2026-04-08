<script setup lang="ts">
import type Image from "~~/server/utils/types";

const props = defineProps<Image>();

const imageDataUrl = computed(() => {
  if (!props.data) return "";
  return `data:${props.mimeType};base64,${props.data}`;
});
</script>

<template>
  <UCard class="shadow">
    <img
      :src="imageDataUrl"
      :alt="`Satellite image ${props.id}`"
      class="w-full h-64 object-cover rounded mb-4"
    />
    <div>
      <p class="font-mono text-sm mb-2">
        {{ props.startDate }} to {{ props.endDate }}
      </p>
      <p class="text-xs mb-1">{{ props.createdAt }}</p>
    </div>
  </UCard>
</template>
