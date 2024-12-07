import axios from 'axios'

const API_KEY = 'f6f6e2be24d04d7b905b90c56f93294a'
const BASE_URL = '/api'; 
 export const matchStatuses = {
    finished: 'FINISHED',
    sheduled: 'SCHEDULED'
 }

 export async function fetchMatchesByStatus(competitionCode, status) {
    const url = `${BASE_URL}/competitions/${competitionCode}/matches?status=${status}`
    const response = await axios.get(url, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    })
    return response.data.matches
  }