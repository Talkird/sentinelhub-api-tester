<script setup lang="ts">
import type Image from "~~/server/utils/types";

const props = defineProps<Image>();

const startDate = computed(() => {
  return new Date(props.startDate).toLocaleDateString();
});

const endDate = computed(() => {
  return new Date(props.endDate).toLocaleDateString();
});

const createdAt = computed(() => {
  return new Date(props.createdAt).toLocaleString();
});

const imageDataUrl = computed(() => {
  if (!props.data) return "";
  return `data:${props.mimeType};base64,${props.data}`;
});
const emit = defineEmits(["imageDeleted"]);

const handleDeleteImage = async () => {
  await $fetch(`/api/images/${props.id}`, {
    method: "DELETE",
  });
  emit("imageDeleted");
};
</script>

<template>
  <UCard class="shadow">
    <img
      :src="imageDataUrl"
      :alt="`Satellite image ${props.id}`"
      class="w-full h-64 object-cover rounded mb-4"
    />
    <div class="flex-col flex gap-2">
      <p class="text-base mb-2">{{ startDate }} to {{ endDate }}</p>
      <p class="text-sm mb-1">Created: {{ createdAt }}</p>
      <UButton
        class="w-fit"
        variant="soft"
        loading-auto
        @click="handleDeleteImage"
      >
        Delete image
      </UButton>
    </div>
  </UCard>
</template>
