<template>
  <div>
    <AppHeader />
    <MatchesSwitcher :currentView="currentView" @update:view="switchView" />
    <!-- Render carousels -->
    <div v-if="currentMatches">
      <div v-for="comp in competitions" :key="comp.code">
        <LeagueCarousel
          :leagueName="comp.name"
          :matches="currentMatches[comp.code] ? currentMatches[comp.code] : []"
          :loading="loading[comp.code]"
        />
      </div>
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
      finishedMatches: null, // { [leagueCode]: []}
      scheduledMatches: null, // { [leagueCode]: []}
      currentMatches: null,
      loading: {}, // { [leagueCode]: boolean }
    }
  },
  computed: {
    competitions() {
      return competitions
    },
  },
  async mounted() {
    this.finishedMatches = await this.loadMatches(matchStatuses.finished)
    this.currentMatches = this.finishedMatches
    console.log(this.currentMatches);    
  },

  methods: {
    async loadMatches(matchStatus) {
      console.log(this.competitions)
      let matches = [];
      // Fetch data for each competition once
      for (const comp of this.competitions) {
        this.loading[comp.code] = true

        const data = await fetchMatchesByStatus(comp.code, matchStatus)
        const mappedMatches = data.map(this.mapMatchData)

        this.loading[comp.code] = false
        matches[comp.code] = mappedMatches
      }
      return matches;
    },

    mapMatchData(match) {
      const defaultOdds = { homeWin: 'N/A', draw: 'N/A', awayWin: 'N/A' }
      let mappedOdds = defaultOdds
      if (match.odds && match.odds.homeWin) {
        // Adjust this based on actual odds structure if available
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
        this.scheduledMatches = await this.loadMatches(matchStatuses.scheduled);
      }

      this.currentMatches = this.currentView === matchStatuses.scheduled? this.scheduledMatches : this.finishedMatches;
    },
  },
}
</script>
