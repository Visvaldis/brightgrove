<template>
  <div>
    <AppHeader />
    <MatchesSwitcher :currentView="currentView" @update:view="switchView" />
    <div v-for="comp in competitions" :key="comp.code">
      <LeagueCarousel 
        :leagueName="comp.name" 
        :matches="leagueMatches[comp.code] ? leagueMatches[comp.code] : []"
      />
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/Header.vue'
import MatchesSwitcher from '../components/Switcher.vue'
import LeagueCarousel from '../components/LeagueCarousel.vue'
import { fetchMatches, competitions } from '../services/footballDataService.js'

export default {
  name: 'Home',
  components: { AppHeader, MatchesSwitcher, LeagueCarousel },
  data() {
    return {
      currentView: 'recent',
      leagueMatches: {}
    }
  },
  computed: {
    competitions() {
      return competitions
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      for (const comp of competitions) {
        const matches = await fetchMatches(comp.code, this.currentView)
        console.log(comp.code, this.currentView, matches);
        
        // odds not always present - we can attach dummy odds if needed
        const enriched = matches.map(m => {
          return {
            ...m,
            odds: m.odds ? m.odds : null
          }
        })
        console.log(enriched)
        this.leagueMatches[comp.code] = enriched
      }
    },
    async switchView(view) {
      if (this.currentView !== view) {
        this.currentView = view
        await this.loadData()
      }
    }
  }
}
</script>
