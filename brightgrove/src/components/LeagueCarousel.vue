<template>
  <div class="league-section">
    <h2>{{ leagueName }}</h2>
    <div class="carousel-container">
      <div 
        v-for="match in matches" 
        :key="match.id" 
        class="match-card"
      >
        <h3>{{ match.homeTeam.name }} vs {{ match.awayTeam.name }}</h3>
        <div class="info">
          <div>Date: {{ formatDate(match.utcDate) }}</div>
          <div v-if="match.venue">Venue: {{ match.venue }}</div>
        </div>
        <div class="odds" v-if="match.odds && match.odds.homeWin">
          Odds - Home: {{ match.odds.homeWin }}, Draw: {{ match.odds.draw }}, Away: {{ match.odds.awayWin }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeagueCarousel',
  props: {
    leagueName: {
      type: String,
      required: true
    },
    matches: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr)
      return d.toLocaleString()
    }
  }
}
</script>
