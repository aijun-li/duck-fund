<template>
  <stock-index
    style="padding-top: 0.3rem; padding-bottom: 0.3rem"
  ></stock-index>
  <div class="divider"></div>
  <fund-list></fund-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store'
import FundList from '@/components/FundList.vue'
import StockIndex from '@/components/StockIndex.vue'

export default defineComponent({
  components: {
    StockIndex,
    FundList
  },
  setup() {
    const store = useStore()
    store.commit('initializeFunds', {
      funds: localStorage.getItem('storedFunds')!
    })
  }
})
</script>

<style lang="scss" scoped>
.divider {
  height: 5px;
  background-color: #e6e6e6;
}
</style>
