<script setup lang="ts">
import type Image from "~~/server/utils/types";
import type { SelectItem } from "#ui/types";
import { dateSchema } from "~/utils/schemas";

const toast = useToast();
const start_date = ref("2024-01-01");
const end_date = ref("2024-01-31");
const selectValue = ref("capillaDelMonte");

const formState = reactive({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
});

const selectItems = ref<SelectItem[]>([
  {
    label: "Capilla del Monte",
    value: "capillaDelMonte",
  },
  {
    label: "Sierras de Córdoba",
    value: "sierrasDeCordoba",
  },
  {
    label: "Norte de San Luis",
    value: "norteSanLuis",
  },

  {
    label: "El Bolsón, Lago Puelo",
    value: "elBolsonLagoPuelo",
  },
  {
    label: "Puerto Patriada",
    value: "puertoPatriada",
  },
  {
    label: "Cushamen",
    value: "cushamen",
  },
  {
    label: "Parque Los Alerces",
    value: "parqueLosAlerces",
  },
  {
    label: "Delta del Paraná",
    value: "deltaDelParana",
  },
  {
    label: "Esteros del Iberá",
    value: "esterosDelIbera",
  },
  {
    label: "Norte Corrientes",
    value: "norteCorrientes",
  },
  {
    label: "Gran Chaco Argentino",
    value: "granChacoArgentino",
  },
  {
    label: "Selva Pedemontana Salta",
    value: "selvaPedemontanaSalta",
  },
  {
    label: "Centro La Pampa",
    value: "centroLaPampa",
  },
]);

const { data: images, refresh } = await useFetch<Image[]>("/api/images");

const saveImage = async () => {
  try {
    await $fetch("/api/images", {
      method: "POST",
      body: {
        startDate: start_date.value,
        endDate: end_date.value,
        region: selectValue.value,
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
  <div class="min-h-screen p-8 bg-neutral-100 dark:bg-neutral-800">
    <div class="max-w-6xl mx-auto">
      <UCard class="mb-8">
        <UForm
          @submit="saveImage"
          :schema="dateSchema"
          :state="formState"
          class="flex-col flex gap-4 mb-4"
        >
          <div class="flex flex-col md:flex-row gap-4">
            <UFormField label="Start date">
              <UInput
                type="text"
                placeholder="Start Date (YYYY-MM-DD)"
                v-model="start_date"
              />
            </UFormField>
            <UFormField label="End date">
              <UInput
                type="text"
                placeholder="End Date (YYYY-MM-DD)"
                v-model="end_date"
              />
            </UFormField>
            <UFormField label="Region">
              <USelect
                class="w-48"
                v-model="selectValue"
                :items="selectItems"
              />
            </UFormField>
          </div>
          <UButton
            type="submit"
            class="font-medium w-full sm:w-fit text-center justify-center"
            loading-auto
          >
            Save Image
          </UButton>
        </UForm>
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
          @image-deleted="refresh"
        />
      </div>
    </div>
  </div>
</template>
