<template>
  <div>
    <AppHeader />
    <MatchesSwitcher :currentView="currentView" @update:view="switchView" />

    <!-- If there's a global error, show it -->
    <div v-if="globalError" class="error-message">
      <p>{{ globalError }}</p>
      <button @click="retryFetch">Retry</button>
    </div>

    <!-- If no global error and we have matches -->
    <div v-else-if="currentMatches">
      <div v-for="comp in competitions" :key="comp.code" class="league-block">
        <h2>{{ comp.name }}</h2>
        <template v-if="loading[comp.code]">
          <div class="loader">Loading {{ comp.name }}...</div>
        </template>
        <template v-else-if="errors[comp.code]">
          <div class="error-message">
            <p>Error loading {{ comp.name }}: {{ errors[comp.code] }}</p>
            <button @click="retryLeague(comp.code)">Retry</button>
          </div>
        </template>
        <template v-else>
          <LeagueCarousel
            :leagueName="comp.name"
            :matches="currentMatches[comp.code] ? currentMatches[comp.code] : []"
          />
        </template>
      </div>
    </div>

    <!-- If not loading, no error, and no data -->
    <div v-else>
      <p>No matches data available.</p>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/Header.vue'
import MatchesSwitcher from '@/components/MatchesSwitcher.vue'
import LeagueCarousel from '@/components/LeagueCarousel.vue'
import { fetchMatchesByStatus } from '@/services/footballDataService.js'
import { matchStatuses } from '@/consts/matchStatuses.js'
import { competitions } from '@/consts/competitions.js'

export default {
  name: 'HomeView',
  components: { AppHeader, MatchesSwitcher, LeagueCarousel },
  data() {
    return {
      currentView: matchStatuses.finished,
      finishedMatches: null,
      scheduledMatches: null,
      currentMatches: null,
      loading: {}, // { [leagueCode]: boolean }
      errors: {}, // { [leagueCode]: string } - store error message per league
      globalError: null, // fallback if everything fails
    }
  },
  computed: {
    competitions() {
      return competitions
    },
  },
  async mounted() {
    try {
      this.finishedMatches = await this.loadMatches(matchStatuses.finished)
      this.currentMatches = this.finishedMatches
    } catch (err) {
      // If fetching finished matches fails for all leagues
      this.globalError = 'Failed to load matches. Please try again later.'
      console.error(err)
    }
  },

  methods: {
    async loadMatches(matchStatus) {
      const matches = {}
      const errors = {}
      const loadingStates = {}

      // Mark all comps as loading
      this.competitions.forEach((comp) => {
        loadingStates[comp.code] = true
        errors[comp.code] = null
      })

      this.loading = { ...this.loading, ...loadingStates }
      this.errors = { ...this.errors, ...errors }

      // Fetch data for each competition in parallel
      const promises = this.competitions.map((comp) => {
        return fetchMatchesByStatus(comp.code, matchStatus)
          .then((data) => ({ compCode: comp.code, data }))
          .catch((err) => ({ compCode: comp.code, error: err }))
      })

      const results = await Promise.all(promises)

      results.forEach((result) => {
        const compCode = result.compCode
        this.loading[compCode] = false
        if (result.error) {
          console.error(`Error fetching data for ${compCode}:`, result.error)
          this.errors[compCode] = result.error.message || 'Unknown error'
          matches[compCode] = []
        } else {
          matches[compCode] = result.data.map(this.mapMatchData)
        }
      })

      // Check if we got any successful data at all
      const hasAtLeastOneSuccess = Object.keys(matches).some((code) => matches[code].length > 0)

      if (!hasAtLeastOneSuccess) {
        // If no competition loaded successfully and we have global error fallback
        // Set a global error if everything fails
        this.globalError = 'Could not load any matches due to network or rate limit issues.'
      }

      return matches
    },

    mapMatchData(match) {
      const defaultOdds = { homeWin: 'N/A', draw: 'N/A', awayWin: 'N/A' }
      let mappedOdds = defaultOdds
      if (match.odds && match.odds.homeWin) {
        mappedOdds = {
          homeWin: match.odds.homeWin || 'N/A',
          draw: match.odds.draw || 'N/A',
          awayWin: match.odds.awayWin || 'N/A',
        }
      }

      return {
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        utcDate: match.utcDate,
        venue: match.venue || 'Unknown',
        status: match.status,
        odds: mappedOdds,
      }
    },

    async switchView(view) {
      this.currentView = view

      if (this.currentView === matchStatuses.scheduled && !this.scheduledMatches) {
        try {
          this.scheduledMatches = await this.loadMatches(matchStatuses.scheduled)
        } catch (err) {
          console.error(err)
          this.globalError = 'Failed to load scheduled matches. Please try again later.'
        }
      }

      this.currentMatches =
        this.currentView === matchStatuses.scheduled ? this.scheduledMatches : this.finishedMatches
    },

    async retryFetch() {
      // Reset global error and try loading finished matches again
      this.globalError = null
      try {
        this.finishedMatches = await this.loadMatches(matchStatuses.finished)
        this.currentMatches = this.finishedMatches
      } catch (err) {
        console.error(err)
        this.globalError = 'Failed to load matches again. Please try later.'
      }
    },

    async retryLeague(compCode) {
      this.errors[compCode] = null
      this.loading[compCode] = true
      try {
        const data = await fetchMatchesByStatus(compCode, this.currentView)
        this.currentMatches[compCode] = data.map(this.mapMatchData)
      } catch (err) {
        console.error(err)
        this.errors[compCode] = 'Still unable to load this league.'
      } finally {
        this.loading[compCode] = false
      }
    },
  },
}
</script>

<style>
.league-block {
  margin-bottom: 20px;
}
.error-message {
  background: #ffe6e6;
  color: #900;
  padding: 10px;
  border-radius: 4px;
  margin: 10px;
}
.error-message button {
  background: #900;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.loader {
  text-align: center;
  padding: 20px;
}
</style>
