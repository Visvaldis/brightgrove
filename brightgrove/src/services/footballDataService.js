import axios from 'axios'

const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY
const BASE_URL = '/api'

export async function fetchMatchesByStatus(competitionCode, status) {
  const url = `${BASE_URL}/competitions/${competitionCode}/matches?status=${status}`
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const response = await axios.get(url, {
        headers: { 'X-Auth-Token': API_KEY },
      })
      return response.data.matches
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Rate limited: Check Retry-After header, if present
        const retryAfter = error.response.headers['x-requestcounter-reset']
          ? parseInt(error.response.headers['x-requestcounter-reset'], 10) * 1000
          : 2000 // default 2 seconds if no header given
        console.log('retryAfter', retryAfter)

        console.warn(`Rate limit hit for ${competitionCode}, retrying in ${retryAfter / 1000}s...`)
        await delay(retryAfter)
        attempt++
      } else {
        // Some other error, rethrow it
        throw error
      }
    }
  }

  throw new Error(
    `Failed to fetch matches for ${competitionCode} after ${maxRetries} attempts due to rate limits.`,
  )
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
