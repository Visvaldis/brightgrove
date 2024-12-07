<template>
  <div class="switcher">
    <button 
      :class="{active: currentView === 'recent'}" 
      @click="$emit('update:view','recent')"
    >Recent Matches</button>
    <button 
      :class="{active: currentView === 'upcoming'}"
      @click="$emit('update:view','upcoming')"
    >Upcoming Matches</button>
  </div>
</template>

<script>
export default {
  name: 'MatchesSwitcher',
  props: {
    currentView: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.switcher {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.switcher button {
  background: #eee;
  border: none;
  padding: 8px 15px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 3px;
}

.switcher button.active {
  background: #000;
  color: #fff;
}
</style>
