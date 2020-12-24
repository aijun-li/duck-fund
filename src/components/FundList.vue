<template>
  <el-table
    :data="funds"
    :header-cell-style="{
      color: 'black',
      padding: '5px 0'
    }"
    :cell-style="{ padding: '3px 0', 'font-size': '0.85rem' }"
    :height="615"
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
      header-align="right"
      sortable
      :sort-method="(a, b) => a.jzzl - b.jzzl"
      min-width="1"
    >
      <template #header>
        <!-- push the header to the right -->
        <div style="flex: 1"></div>
        <div>
          <div>净值</div>
          <div class="value-date">
            <!-- A default '00-00' is needed in order to calculate the height of the table body -->
            {{ valueDate.net ? valueDate.net.slice(5, 10) : '00-00' }}
          </div>
        </div>
      </template>
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
          <div
            v-if="scope.row.jzrq && scope.row.jzrq !== valueDate.net"
            class="value-date"
          >
            {{ scope.row.jzrq.slice(5, 10) }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      :sort-method="(a, b) => a.gszzl - b.gszzl"
      header-align="right"
      min-width="1"
    >
      <template #header>
        <!-- push the header to the right -->
        <div style="flex: 1"></div>
        <div>
          <div>估值</div>
          <div class="value-date">
            <!-- A default '00-00' is needed in order to calculate the height of the table body -->
            {{ valueDate.estimate ? valueDate.estimate.slice(5, 10) : '00-00' }}
          </div>
        </div>
      </template>
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
import { computed, defineComponent, inject, onMounted, reactive } from 'vue'
import { State, useStore } from '@/store'
import { Store } from 'vuex'
import StockPrice from '@/interfaces/StockPrice'

function fetchData(axios: AxiosStatic, store: Store<State>, valueDate: any) {
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
      price.jzrq = response2.split('|')[0]
      price.dwjz = response2.split('|')[1]

      // update the displayed date of value
      if (
        !valueDate.net ||
        new Date(valueDate.net).getTime() < new Date(price.jzrq!).getTime()
      ) {
        valueDate.net = price.jzrq
      }
      if (
        !valueDate.estimate ||
        new Date(valueDate.estimate).getTime() <
          new Date(price.gztime!.split(' ')[0]).getTime()
      ) {
        valueDate.estimate = price.gztime
      }

      store.commit('updateFund', price)
    })
  }

  return { funds, fetchPrice }
}

export default defineComponent({
  setup() {
    const axios = inject<AxiosStatic>('axios')!
    const store = useStore()

    const valueDate = reactive({ net: '', estimate: '' })
    const { funds, fetchPrice } = fetchData(axios, store, valueDate)

    fetchPrice()
    onMounted(() => {
      setInterval(fetchPrice, 10000)
    })

    return { funds, valueDate }
  }
})
</script>

<style lang="scss" scoped>
.el-table {
  color: black;
}

.value-cell {
  text-align: right;
  padding-right: 1rem;
}

.value-date {
  font-size: 0.8rem;
  color: grey;
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
