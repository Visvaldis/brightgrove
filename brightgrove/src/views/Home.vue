<template>
  <div>
    <AppHeader />
    <MatchesSwitcher :currentView="currentView" @update:view="switchView" />
    <!-- Render carousels -->
    <div v-for="comp in competitions" :key="comp.code">
      <LeagueCarousel 
        :leagueName="comp.name" 
        :matches="leagueMatches[comp.code] ? leagueMatches[comp.code][currentView] : []"
        :loading="loading[comp.code]"
      />
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/Header.vue'
import MatchesSwitcher from '@/components/MatchesSwitcher.vue'
import LeagueCarousel from '@/components/LeagueCarousel.vue'
import {fetchMatchesByStatus, matchStatuses} from '@/services/footballDataService.js'
import {competitions} from '@/consts/competitions.js'

export default {
  name: 'Home',
  components: { AppHeader, MatchesSwitcher, LeagueCarousel },
  data() {
    return {
      currentView: 'recent', // 'recent' or 'upcoming'
      recentMatches: {},   // { [leagueCode]: []}
      upcomingMatches: {},  // { [leagueCode]: []}
      leagueMatches: {}, // { [leagueCode]: { recent: [], upcoming: [] }}
      loading: {} // { [leagueCode]: boolean }
    }
  },
  computed: {
  },
  async mounted() {
    await this.loadRecent()

  },
  methods: {
    async loadRecent() {
      console.log(competitions);
      
      // Fetch data for each competition once
      for (const comp of competitions) {
        this.loading[comp.code] = true

        const data = await fetchMatchesByStatus(comp.code, matchStatuses.finished)
        // Map odds and ensure no placeholders are needed
        console.log('match', data);

        const mappedRecent = data.map(this.mapMatchData)
       // const mappedUpcoming = data.upcoming.map(this.mapMatchData)

        this.leagueMatches[comp.code] = {
          recent: mappedRecent,
       //   upcoming: mappedUpcoming
        }

        this.loading[comp.code] = false
      }
    },

    mapMatchData(match) {
      const defaultOdds = { homeWin: 'N/A', draw: 'N/A', awayWin: 'N/A' }
      let mappedOdds = defaultOdds
      if (match.odds && match.odds.homeWin) {
        // Adjust this based on actual odds structure if available
        mappedOdds = {
          homeWin: match.odds.homeWin || 'N/A',
          draw: match.odds.draw || 'N/A',
          awayWin: match.odds.awayWin || 'N/A'
        }
      }
      
      return {
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        utcDate: match.utcDate,
        venue: match.venue || 'Unknown',
        status: match.status,
        odds: mappedOdds
      }
    },

    async switchView(view) {
      this.currentView = view
      // No need to reload data since we stored both recent and upcoming
    }
  }
}
</script>
