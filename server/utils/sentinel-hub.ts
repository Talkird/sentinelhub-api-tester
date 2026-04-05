import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SH_API_URL = 'https://services.sentinel-hub.com/api/v1/process'
const SH_TOKEN_URL = 'https://services.sentinel-hub.com/oauth/token'
const BBOX_CORDOBA = [-64.55, -30.95, -64.45, -30.85]

let accessToken = ''
let accessTokenExpiresAt = 0

const trainingDataDir = path.join(process.cwd(), 'public', 'training_data')

// Ensure training_data directory exists
if (!fs.existsSync(trainingDataDir)) {
  fs.mkdirSync(trainingDataDir, { recursive: true })
}

export { trainingDataDir, BBOX_CORDOBA, SH_API_URL, SH_TOKEN_URL }

const getEnvValue = (key: string): string => {
  const value = process.env[key]
  return value ? value.trim().replace(/^"|"$/g, '') : ''
}

export const getOAuthCredentials = (): { clientId: string; clientSecret: string } => {
  const clientId = getEnvValue('CLIENTID') || getEnvValue('VITE_CLIENTID') || ''
  const clientSecret = getEnvValue('SECRET') || getEnvValue('VITE_SECRET') || ''

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing OAuth credentials. Set CLIENTID and SECRET in .env.',
    )
  }

  return { clientId, clientSecret }
}

export const getAccessToken = async (): Promise<string> => {
  if (accessToken && Date.now() < accessTokenExpiresAt) {
    return accessToken
  }

  const { clientId, clientSecret } = getOAuthCredentials()
  const tokenBody = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const tokenResponse = await fetch(SH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenBody.toString(),
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    throw new Error(
      `OAuth token request failed (${tokenResponse.status}): ${errorText}`,
    )
  }

  const tokenData = await tokenResponse.json() as any
  if (!tokenData?.access_token) {
    throw new Error('OAuth token response missing access_token.')
  }

  accessToken = tokenData.access_token
  const expiresInMs = (Number(tokenData.expires_in) || 3600) * 1000
  accessTokenExpiresAt = Date.now() + expiresInMs - 60 * 1000

  return accessToken
}

export const fetchSentinelHubImage = async (
  startDate: string,
  endDate: string,
): Promise<{ buffer: Buffer; timestamp: number }> => {
  const token = await getAccessToken()

  const payload = {
    input: {
      bounds: {
        properties: { crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84' },
        bbox: BBOX_CORDOBA,
      },
      data: [
        {
          type: 'sentinel-2-l2a',
          dataFilter: {
            timeRange: {
              from: `${startDate}T00:00:00Z`,
              to: `${endDate}T23:59:59Z`,
            },
            maxCloudCoverage: 30,
            mosaickingOrder: 'mostRecent',
          },
        },
      ],
    },
    output: {
      width: 350,
      height: 350,
      responses: [{ identifier: 'default', format: { type: 'image/jpeg' } }],
    },
    evalscript: `//VERSION=3
function setup() {
  return { input: ["B04", "B03", "B02"], output: { bands: 3 } };
}
function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}
`,
  }

  const shResponse = await fetch(SH_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!shResponse.ok) {
    const errorText = await shResponse.text()
    throw new Error(
      `Sentinel Hub request failed (${shResponse.status}): ${errorText}`,
    )
  }

  const arrayBuffer = await shResponse.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const timestamp = Date.now()

  return { buffer, timestamp }
}
