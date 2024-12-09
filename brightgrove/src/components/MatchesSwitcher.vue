<template>
  <div class="switcher">
    <button :class="{ active: currentView === statuses.finished }"
     @click="$emit('update:view', statuses.finished )">
      Recent Matches
    </button>
    <button
      :class="{ active: currentView === statuses.scheduled }"
      @click="$emit('update:view', statuses.scheduled )"
    >
      Upcoming Matches
    </button>
  </div>
</template>

<script>
import { matchStatuses } from '@/consts/matchStatuses.js'

export default {
  name: 'MatchesSwitcher',
  props: {
    currentView: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tt: matchStatuses.finished,
    }
  },
  computed:
  {
    statuses(){
      return matchStatuses
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
