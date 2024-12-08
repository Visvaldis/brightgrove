<template>
  <div class="league-section">
    <h2>{{ leagueName }}</h2>

    <div v-if="loading" class="loader">Loading...</div>
    <div v-else class="carousel-container">
      <MatchCard v-for="match in matches" :key="match.id" :match="match" />
    </div>
  </div>
</template>

<script>
import MatchCard from './MatchCard.vue'

export default {
  name: 'LeagueCarousel',
  components: { MatchCard },
  props: {
    leagueName: {
      type: String,
      required: true,
    },
    matches: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    console.log('mounted', this.leagueName)
  },
}
</script>

<style scoped>
.league-section {
  margin: 10px 0;
}
.league-section h2 {
  font-size: 16px;
  margin: 10px;
  font-weight: 600;
}

.carousel-container {
  overflow-x: scroll;
  display: flex;
  gap: 10px;
  padding: 10px;
  scroll-behavior: smooth;
}

.loader {
  text-align: center;
  font-size: 14px;
  padding: 20px;
  color: #666;
}
</style>
