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
        v-if="change != 0"
        :icon="[
          'fas',
          change < 0 ? 'long-arrow-alt-down' : 'long-arrow-alt-up'
        ]"
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
      &nbsp;
      <span>{{ Number.isNaN(changeP) ? '0.00' : changeP.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosStatic } from 'axios'
import { computed, defineComponent, inject, onMounted, reactive } from 'vue'

const indexCode = new Map([
  ['上证指数', '1.000001'],
  ['深证成指', '0.399001'],
  ['创业板指', '0.399006'],
  ['沪深300', '1.000300'],
  ['上证50', '1.000016'],
  ['中证500', '1.000905']
])

function fetchData(axios: AxiosStatic) {
  const info = reactive({
    price: 0,
    pre: 0
  })

  async function fetchIndexInfo(code: string) {
    const { data: response } = await axios.get(
      `http://push2.eastmoney.com/api/qt/stock/trends2/get?secid=${code}&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58`
    )
    const data = response.data
    info.pre = data.preClose
    info.price = parseFloat(data.trends.pop().split(',')[2])
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
    const axios = inject<AxiosStatic>('axios')!
    const code = indexCode.get(props.name)!

    const { info, fetchIndexInfo } = fetchData(axios)
    const change = computed(() => info.price - info.pre)
    const changeP = computed(() => (change.value / info.pre) * 100)
    fetchIndexInfo(code)

    onMounted(() => {
      setInterval(() => fetchIndexInfo(code), 5000)
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
