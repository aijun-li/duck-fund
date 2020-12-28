<template>
  <el-table
    :data="funds"
    :header-cell-style="{
      color: 'black',
      padding: '2px 0'
    }"
    :cell-style="{ padding: '3px 0', 'font-size': '0.85rem' }"
    :height="615"
    empty-text="暂无关注基金"
  >
    <el-table-column label="基金名称" min-width="2">
      <template #default="scope">
        <div class="table-text-height" style="text-align: left">
          {{ scope.row.name ? scope.row.name : 'loading...' }}
        </div>
        <div class="table-text-height" style="color: grey; text-align: left">
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
          <div class="table-text-height">
            {{ scope.row.dwjz ? scope.row.dwjz : '0.0000' }}
          </div>
          <div
            :class="[
              {
                'price-up': scope.row.jzzl && scope.row.jzzl > 0,
                'price-down': scope.row.jzzl && scope.row.jzzl < 0
              },
              'change-percent',
              'table-text-height'
            ]"
          >
            {{
              `${scope.row.jzzl && scope.row.jzzl > 0 ? '+' : ''}${
                scope.row.jzzl ? scope.row.jzzl : '0.00'
              }`
            }}%
          </div>
          <div
            v-if="scope.row.jzrq && scope.row.jzrq !== valueDate.net"
            class="value-date table-text-height"
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
          <div class="table-text-height">
            {{ scope.row.gsz ? scope.row.gsz : '0.0000' }}
          </div>
          <div
            :class="[
              {
                'price-up': scope.row.gszzl && scope.row.gszzl > 0,
                'price-down': scope.row.gszzl && scope.row.gszzl < 0
              },
              'change-percent',
              'table-text-height'
            ]"
          >
            {{
              `${scope.row.gszzl && scope.row.gszzl > 0 ? '+' : ''}${
                scope.row.gszzl ? scope.row.gszzl : '0.00'
              }`
            }}%
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <!-- Update info -->
  <el-row class="bottom-info">
    <el-col :span="12" class="icon-area">
      <router-link to="/search" replace>
        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
      </router-link>
    </el-col>
    <el-col :span="12" style="text-align: right">
      估值更新于
      {{ valueDate.estimate ? valueDate.estimate.slice(-5) : '--:--' }}
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { AxiosStatic } from 'axios'
import { computed, defineComponent, inject, onMounted, reactive } from 'vue'
import { State, useStore } from '@/store'
import { Store } from 'vuex'
import StockPrice from '@/interfaces/StockPrice'
import { isNowInTimePeriod } from '@/utils'

function fetchData(axios: AxiosStatic, store: Store<State>, valueDate: any) {
  const funds = computed(() => store.state.funds)

  function fetchPrice() {
    funds.value.forEach(async fund => {
      let price: StockPrice = { fundcode: fund.fundcode }

      // retrieve the estimated value of fund
      if (
        !fund.gsz ||
        !fund.gszzl ||
        !fund.gztime ||
        isNowInTimePeriod('09:30:00', '15:40:00')
      ) {
        const { data: response1 } = await axios.get(
          `http://fundgz.1234567.com.cn/js/${fund.fundcode}.js`,
          {
            headers: { 'Cache-Control': 'no-cache' }
          }
        )
        price = JSON.parse(response1.match(/jsonpgz\((.*)\);/)![1])
      }

      // retrieve the change of net value in percentage
      if (
        !fund.jzzl ||
        (fund.gztime &&
          isNowInTimePeriod('19:00:00', '23:59:59') &&
          fund.jzrq !== fund.gztime.slice(0, 10))
      ) {
        const { data: response2 } = await axios.get(
          `http://api.fund.eastmoney.com/f10/lsjz?fundCode=${fund.fundcode}&pageIndex=1&pageSize=1`,
          {
            headers: { 'Cache-Control': 'no-cache' }
          }
        )
        const jz = response2.Data.LSJZList[0]
        price.jzrq = jz.FSRQ
        price.dwjz = jz.DWJZ
        price.jzzl = jz.JZZZL
      }

      // update the displayed date of value
      if (
        price.jzrq &&
        (!valueDate.net ||
          new Date(valueDate.net).getTime() < new Date(price.jzrq!).getTime())
      ) {
        valueDate.net = price.jzrq
      } else if (fund.jzrq && !valueDate.net) {
        valueDate.net = fund.jzrq
      }

      if (
        price.gztime &&
        (!valueDate.estimate ||
          new Date(valueDate.estimate).getTime() <
            new Date(price.gztime!).getTime())
      ) {
        valueDate.estimate = price.gztime
      } else if (fund.gztime && !valueDate.estimate) {
        valueDate.estimate = fund.gztime
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
      setInterval(fetchPrice, 30000)
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

.table-text-height {
  height: 20px;
  line-height: 20px;
}

.price-up {
  color: red;
}

.price-down {
  color: green;
}

.bottom-info {
  font-size: 0.75rem;
  color: grey;
  padding: 0.2rem 0.6rem;

  .icon-area {
    display: flex;
    align-items: center;

    a {
      color: grey;
      &:hover {
        color: black;
      }
    }
  }
}
</style>
