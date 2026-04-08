<script setup lang="ts">
import type Image from "~~/server/utils/types";

const toast = useToast();
const start_date = ref("2024-01-01");
const end_date = ref("2024-01-31");

const { data: images, refresh } = await useFetch<Image[]>("/api/images");

const saveImage = async () => {
  try {
    await $fetch("/api/images", {
      method: "POST",
      body: {
        startDate: start_date.value,
        endDate: end_date.value,
      },
    });
    await refresh();

    toast.add({
      title: "Success",
      description: "Image saved successfully.",
      color: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    toast.add({
      title: "Error",
      description: "Failed to save image.",
      color: "error",
    });
  }
};
</script>

<template>
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <UCard class="mb-8">
        <p class="text-sm mb-4">
          Sentinel Hub:
          <ULink
            class="text-primary hover:underline transition"
            to="https://insights.planet.com/analyze/requests-builder/"
            target="_blank"
          >
            Request Builder
          </ULink>
        </p>

        <div class="flex-col md:flex-row flex gap-4 mb-4">
          <UInput
            type="text"
            placeholder="Start Date (YYYY-MM-DD)"
            v-model="start_date"
          />
          <UInput
            type="text"
            placeholder="End Date (YYYY-MM-DD)"
            v-model="end_date"
          />
        </div>
        <UButton
          @click="saveImage"
          class="font-medium w-full sm:w-auto"
          loading-auto
        >
          Save Image
        </UButton>
      </UCard>

      <div
        v-if="images"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ImgCard
          v-for="image in images"
          :key="image.id"
          :id="image.id"
          :data="image.data"
          :mimeType="image.mimeType"
          :createdAt="image.createdAt"
          :startDate="image.startDate"
          :endDate="image.endDate"
        />
      </div>
    </div>
  </div>
</template>
