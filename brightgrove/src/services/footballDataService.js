import axios from 'axios'

const API_KEY = 'f6f6e2be24d04d7b905b90c56f93294a'
const BASE_URL = '/api'; 

const competitions = [
  { code: 'PPL', name: 'Primeira Liga (Portugal)' },
  { code: 'PL', name: 'Premier League (England)' },
  { code: 'DED', name: 'Eredivisie (Netherlands)' },
  { code: 'BL1', name: 'Bundesliga (Germany)' },
  { code: 'SA', name: 'Serie A (Italy)' },
  { code: 'PD', name: 'La Liga (Spain)' },
  { code: 'BSA', name: 'Serie A (Brazil)' }
]

export { competitions }

export async function fetchMatches(competitionCode, type = 'recent') {
  // type: 'recent' or 'upcoming'
  const status = type === 'recent' ? 'FINISHED' : 'SCHEDULED'
  const url = `${BASE_URL}/competitions/${competitionCode}/matches?status=${status}`
  const response = await axios.get(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  })
  return response.data.matches
}
