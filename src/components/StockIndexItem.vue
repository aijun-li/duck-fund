<template>
  <div class="index-item">
    <div class="index-name">{{ name }}</div>
    <div
      :class="[
        'index-price',
        { 'price-down': change < 0 },
        { 'price-up': change > 0 }
      ]"
    >
      {{ info.price.toFixed(2) }}
      <font-awesome-icon
        class="arrow-indicator"
        v-if="change > 0"
        :icon="['fas', 'long-arrow-alt-up']"
      />
      <font-awesome-icon
        class="arrow-indicator"
        v-else-if="change < 0"
        :icon="['fas', 'long-arrow-alt-down']"
      />
    </div>
    <div
      :class="[
        'index-change',
        { 'price-down': change < 0 },
        { 'price-up': change > 0 }
      ]"
    >
      <span>{{ change.toFixed(2) }}</span>
      &ensp;
      <span>{{ Number.isNaN(changeP) ? '0.00' : changeP.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onActivated,
  onDeactivated,
  reactive
} from 'vue'
import { isNowInTimePeriod, isWeekday } from '@/utils'
import axios from '@/plugins/axios'

const indexCode = new Map([
  ['上证指数', '1.000001'],
  ['深证成指', '0.399001'],
  ['创业板指', '0.399006'],
  ['沪深300', '1.000300'],
  ['上证50', '1.000016'],
  ['中证500', '1.000905']
])

function useFetch() {
  const info = reactive({
    price: 0,
    pre: 0
  })

  async function fetchIndexInfo(code: string) {
    const {
      data: { data: response }
    } = await axios.get(
      `http://push2.eastmoney.com/api/qt/stock/get?secid=${code}&fields=f43,f60`
    )
    info.pre = response.f60 / 100
    info.price = response.f43 / 100
  }

  return { info, fetchIndexInfo }
}

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const code = indexCode.get(props.name)!
    let timer: number

    const { info, fetchIndexInfo } = useFetch()
    const change = computed(() => info.price - info.pre)
    const changeP = computed(() => (change.value / info.pre) * 100)

    onActivated(() => {
      clearInterval(timer)
      fetchIndexInfo(code)
      timer = window.setInterval(() => {
        if (
          isWeekday() &&
          (isNowInTimePeriod('09:30:00', '11:30:30') ||
            isNowInTimePeriod('13:00:00', '15:00:30'))
        ) {
          fetchIndexInfo(code)
        }
      }, 10000)
    })

    onDeactivated(() => {
      clearInterval(timer)
    })

    return { info, change, changeP }
  }
})
</script>

<style lang="scss" scoped>
.index-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .index-name {
    font-size: 0.85rem;
  }

  .index-price {
    position: relative;
    font-size: 0.95rem;
    .arrow-indicator {
      position: absolute;
      right: -0.4rem;
      top: 0.2rem;
      font-size: 0.65rem;
    }
  }

  .index-change {
    font-size: 0.8rem;
    span:last-child {
      position: relative;
    }
    span:last-child::after {
      content: '%';
      position: absolute;
      right: -0.65rem;
    }
  }
}

.price-up {
  color: red;
}

.price-down {
  color: green;
}
</style>
