<template>
  <mac-title-bar v-if="platform === 'darwin'"></mac-title-bar>
  <win-title-bar v-else-if="platform === 'win32'"></win-title-bar>
  <router-view v-slot="{ Component }">
    <keep-alive include="Home">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from './store'
import MacTitleBar from '@/components/MacTitleBar.vue'
import WinTitleBar from '@/components/WinTitleBar.vue'

export default defineComponent({
  components: {
    MacTitleBar,
    WinTitleBar
  },
  setup() {
    const platform = process.platform
    const store = useStore()
    store.commit('initializeFunds')

    return { platform }
  }
})
</script>
