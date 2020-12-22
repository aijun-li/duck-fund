<template>
  <el-table
    :data="funds"
    :header-cell-style="{
      color: 'black',
      padding: '5px 0',
      'font-weight': 'bold'
    }"
    :cell-style="{ padding: '3px 0' }"
  >
    <el-table-column label="基金名称" min-width="2">
      <template #default="scope">
        <div style="text-align: left">{{ scope.row.name }}</div>
        <div style="color: grey; text-align: left">
          {{ scope.row.fundcode }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="dwjz"
      label="净值"
      header-align="right"
      sortable
      :sort-method="(a, b) => a.jzzl - b.jzzl"
      min-width="1"
    >
      <template #default="scope">
        <div class="value-cell">
          <div>
            {{ scope.row.dwjz }}
          </div>
          <div
            :class="[
              {
                'price-up': scope.row.jzzl > 0,
                'price-down': scope.row.jzzl < 0
              },
              'change-percent'
            ]"
          >
            {{ (scope.row.jzzl > 0 ? '+' : '') + scope.row.jzzl }}%
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="估值"
      sortable
      :sort-method="(a, b) => a.gszzl - b.gszzl"
      header-align="right"
      min-width="1"
    >
      <template #default="scope">
        <div class="value-cell">
          <div>{{ scope.row.gsz }}</div>
          <div
            :class="[
              {
                'price-up': scope.row.gszzl > 0,
                'price-down': scope.row.gszzl < 0
              },
              'change-percent'
            ]"
          >
            {{ (scope.row.gszzl > 0 ? '+' : '') + scope.row.gszzl }}%
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { AxiosStatic } from 'axios'
import { computed, defineComponent, inject, onMounted } from 'vue'
import { State, useStore } from '@/store'
import { Store } from 'vuex'
import StockPrice from '@/interfaces/StockPrice'

function fetchData(axios: AxiosStatic, store: Store<State>) {
  const funds = computed(() => store.state.funds)

  function fetchPrice() {
    funds.value.forEach(async fund => {
      // retrieve the estimated value of fund
      const { data: response1 } = await axios.get(
        `http://fundgz.1234567.com.cn/js/${fund.fundcode}.js`,
        {
          headers: { 'Cache-Control': 'no-cache' }
        }
      )
      const price: StockPrice = JSON.parse(
        response1.match(/jsonpgz\((.*)\);/)![1]
      )
      // retrieve the previous day's change of value in percentage
      const { data: response2 } = await axios.get(
        `https://www.dayfund.cn/ajs/ajaxdata.shtml?showtype=getfundvalue&fundcode=${fund.fundcode}`
      )
      price.jzzl = parseFloat(response2.split('|')[4].slice(0, -1)).toFixed(2)
      store.commit('updateFund', price)
    })
  }

  return { funds, fetchPrice }
}

export default defineComponent({
  setup() {
    const axios = inject<AxiosStatic>('axios')!
    const store = useStore()

    const { funds, fetchPrice } = fetchData(axios, store)

    fetchPrice()
    onMounted(() => {
      setInterval(fetchPrice, 10000)
    })

    return { funds }
  }
})
</script>

<style lang="scss" scoped>
.el-table {
  color: black;
}

.value-cell {
  text-align: right;
  padding-right: 0.8rem;
}

.change-percent {
  font-size: 0.8rem;
}

.price-up {
  color: red;
}

.price-down {
  color: green;
}
</style>