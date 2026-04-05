import fs from 'fs'
import path from 'path'
import { fetchSentinelHubImage, trainingDataDir } from '../utils/sentinel-hub'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  }

  try {
    const body = await readBody(event)
    const startDate = body?.startDate
    const endDate = body?.endDate

    if (!startDate || !endDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'startDate and endDate are required (YYYY-MM-DD).',
      })
    }

    const { buffer, timestamp } = await fetchSentinelHubImage(startDate, endDate)

    const filename = `sentinel-hub-${timestamp}.jpg`
    const filepath = path.join(trainingDataDir, filename)

    fs.writeFileSync(filepath, buffer)
    const stats = fs.statSync(filepath)

    return {
      success: true,
      filename,
      size: stats.size,
      url: `/training_data/${filename}`,
      date: new Date(stats.mtime).toLocaleString(),
      message: `✓ Image fetched and saved to training_data/${filename}`,
    }
  }
  catch (error) {
    console.error('Error fetching image from Sentinel Hub:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      statusMessage: message,
    })
  }
})
