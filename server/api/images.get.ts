import fs from 'fs'
import path from 'path'
import { trainingDataDir } from '../utils/sentinel-hub'

export default defineEventHandler((event) => {
  if (event.node.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  }

  try {
    const files = fs
      .readdirSync(trainingDataDir)
      .filter((file) => file.toLowerCase().endsWith('.jpg'))
      .sort()

    const images = files.map((file) => {
      const filepath = path.join(trainingDataDir, file)
      const stats = fs.statSync(filepath)
      return {
        filename: file,
        url: `/training_data/${file}`,
        size: stats.size,
        date: new Date(stats.mtime).toLocaleString(),
      }
    })

    console.log(`✓ Listed ${images.length} images`)

    return {
      success: true,
      count: images.length,
      images,
    }
  }
  catch (error) {
    console.error('Error listing images:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      statusMessage: message,
    })
  }
})
