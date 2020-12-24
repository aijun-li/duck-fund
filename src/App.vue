<template>
  <title-bar></title-bar>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from './store'
import TitleBar from '@/components/TitleBar.vue'

export default defineComponent({
  components: {
    TitleBar
  },
  setup() {
    const store = useStore()
    store.commit('initializeFunds')
  }
})
</script>
