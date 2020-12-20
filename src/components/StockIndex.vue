<template>
  <el-row>
    <el-col v-for="index of indexList" :key="index" :xs="8" :sm="4">
      <stock-index-item :name="index"></stock-index-item>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import StockIndexItem from './StockIndexItem.vue'

export default defineComponent({
  components: {
    StockIndexItem
  },
  setup() {
    const indexList = [
      '上证指数',
      '深证成指',
      '创业板指',
      '沪深300',
      '上证50',
      '中证500'
    ]

    return { indexList }
  }
})
</script>

<style lang="scss" scoped>
.el-row {
  padding-right: 1rem;
}
.el-col {
  padding: 0.25rem 0;
}
</style>
