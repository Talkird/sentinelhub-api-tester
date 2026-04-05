<script setup lang="ts">
import { onMounted, ref } from 'vue'

const images = ref([])
const isLoading = ref(false)
const statusMessage = ref('')
const start_date = ref('2024-01-01')
const end_date = ref('2024-01-31')

const fetchAndSaveImage = async () => {
  try {
    isLoading.value = true
    statusMessage.value = 'Fetching satellite data...'

    const response = await fetch('/api/fetch-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: start_date.value,
        endDate: end_date.value,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const saveResult = await response.json()

    images.value.push({
      id: saveResult.filename,
      url: saveResult.url,
      date: saveResult.date,
      filename: saveResult.filename,
      size: saveResult.size,
    })

    statusMessage.value = saveResult.message
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }
  catch (error) {
    console.error('Error:', error)
    statusMessage.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
  finally {
    isLoading.value = false
  }
}

const loadSavedImages = async () => {
  try {
    const response = await fetch('/api/images')
    if (!response.ok) {
      console.warn('Could not load saved images from backend')
      return
    }

    const result = await response.json()
    images.value = result.images.map((img: any) => ({
      id: img.filename,
      url: img.url,
      date: img.date,
      filename: img.filename,
      size: img.size,
    }))

    if (result.count > 0) {
      statusMessage.value = `✓ Loaded ${result.count} saved image${result.count !== 1 ? 's' : ''}`
      setTimeout(() => {
        statusMessage.value = ''
      }, 2000)
    }
  }
  catch (error) {
    console.error('Error loading saved images:', error)
  }
}

onMounted(() => {
  loadSavedImages()
})
</script>

<template>
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="font-bold text-3xl mb-6">Sentinel Hub API Tester</h1>

      <UCard class="mb-8">
        <div class="mb-4">
          <p class="text-sm font-semibold mb-2">
            Auth Mode: <UBadge color="green">✓ OAuth via backend</UBadge>
          </p>
          <p class="text-xs mb-2">
            Credentials are now kept server-side to avoid browser CORS and
            secret exposure. If auth fails, verify your backend .env values for
            CLIENTID and SECRET.
          </p>
          <p class="text-xs mb-2">
            Configure credentials in
            <code class="font-mono">.env</code>
            and restart the server.
          </p>
          <p class="text-xs">
            Sentinel Hub docs:
            <ULink
              to="https://www.sentinel-hub.com/"
              target="_blank"
            >
              OAuth credentials
            </ULink>
          </p>
        </div>
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
          @click="fetchAndSaveImage"
          :disabled="isLoading"
          block
        >
          {{ isLoading ? 'Loading...' : 'Fetch & Save' }}
        </UButton>

        <!-- Status Message -->
        <UAlert
          v-if="statusMessage"
          :title="statusMessage"
          :color="statusMessage.includes('Error') ? 'red' : statusMessage.includes('✓') ? 'green' : 'blue'"
          class="mt-4"
        />
      </UCard>

      <!-- Gallery Grid -->
      <div v-if="images.length > 0">
        <h2 class="text-2xl font-bold mb-4">
          Saved Images ({{ images.length }})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="image in images"
            :key="image.id"
          >
            <img
              :src="image.url"
              :alt="`Satellite image ${image.id}`"
              class="w-full h-64 object-cover rounded mb-4"
            />
            <div>
              <p class="font-mono text-sm mb-2">
                {{ image.filename }}
              </p>
              <p class="text-xs mb-1">{{ image.date }}</p>
              <p class="text-xs">
                {{ (image.size / 1024).toFixed(2) }} KB
              </p>
            </div>
          </UCard>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-lg">
          No images yet. Fetch to get started!
        </p>
      </div>
    </div>
  </div>
</template>
