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
