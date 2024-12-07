<template>
    <div class="match-card">
      <h3 class="teams">{{ match.homeTeam.name }} vs {{ match.awayTeam.name }}</h3>
      <div class="info">
        <div class="date">Date: {{ formatDate(match.utcDate) }}</div>
        <div v-if="match.venue" class="venue">Venue: {{ match.venue }}</div>
        <div class="status">Status: {{ match.status }}</div>
      </div>
      <div class="odds">
        <h4>Odds:</h4>
        <div>Home: {{ match.odds.homeWin }}</div>
        <div>Draw: {{ match.odds.draw }}</div>
        <div>Away: {{ match.odds.awayWin }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MatchCard',
    props: {
      match: {
        type: Object,
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
  
  <style scoped>
  .match-card {
    flex: 0 0 auto;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 200px;
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .match-card .teams {
    font-size: 14px;
    margin: 0 0 5px;
  }
  .match-card .info {
    font-size: 12px;
    color: #555;
    margin-bottom: 10px;
  }
  .match-card .odds h4 {
    margin: 0 0 5px;
    font-size: 13px;
  }
  .match-card .odds div {
    font-size: 12px;
  }
  </style>
  