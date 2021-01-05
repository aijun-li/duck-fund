<template>
  <el-row class="input-row" type="flex" justify="space-between">
    <el-col :span="19">
      <el-input
        v-model="keyword"
        placeholder="请输入基金代码、名称或简拼"
        @keyup="fetchSuggestions(keyword)"
        ref="inputRef"
        clearable
      ></el-input>
    </el-col>
    <el-col :span="5" style="text-align: right">
      <el-button plain @click="goBack">取消</el-button>
    </el-col>
  </el-row>

  <div class="suggestion-list">
    <el-card
      v-for="suggestion of suggestions"
      :key="suggestion.fundcode"
      shadow="hover"
      class="suggestion-item"
      :body-style="{ padding: '10px' }"
    >
      <el-row>
        <el-col :span="18">
          <div>{{ suggestion.name }}</div>
          <div style="color: grey; margin-top: 2px">
            {{ suggestion.fundcode }}
          </div>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <div>
            <label class="switch-label">关注</label>
            <el-switch
              v-model="suggestion.isStored"
              active-color="#67C23A"
              @change="toggleStored($event, suggestion)"
            ></el-switch>
          </div>
          <div style="margin-top: 3px">
            <label class="switch-label">持有</label>
            <el-switch
              v-model="suggestion.hold"
              active-color="#F56C6C"
              @change="toggleHold($event, suggestion)"
            ></el-switch>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import StockPrice from '@/interfaces/StockPrice'
import axios from '@/plugins/axios'
import { defineComponent, onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { State, useStore } from '@/store'
import { Store } from 'vuex'

function useSuggestion(delay: number, store: Store<State>) {
  const suggestions = ref([] as StockPrice[])

  let timer: number
  function fetchSuggestions(keyword: string) {
    clearTimeout(timer)
    timer = window.setTimeout(async () => {
      const { data: response } = await axios.get(
        `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${encodeURIComponent(
          keyword
        )}`
      )
      suggestions.value = response.Datas.map((suggestion: any) => ({
        fundcode: suggestion.CODE,
        name: suggestion.NAME,
        isStored:
          store.state.funds.findIndex(
            item => item.fundcode == suggestion.CODE
          ) !== -1,
        hold:
          store.state.funds.findIndex(
            item => item.fundcode === suggestion.CODE
          ) !== -1 &&
          store.state.funds.find(item => item.fundcode === suggestion.CODE)!
            .hold
      }))
    }, delay)
  }

  function toggleStored(toStore: boolean, fund: StockPrice) {
    if (toStore) {
      store.commit('addFund', { fundcode: fund.fundcode, hold: false })
    } else {
      store.commit('removeFund', { fundcode: fund.fundcode })
      fund.hold && (fund.hold = false)
    }
  }

  function toggleHold(toHold: boolean, fund: StockPrice) {
    if (toHold && fund.isStored) {
      store.commit('updateFund', { fundcode: fund.fundcode, hold: true })
    } else if (toHold && !fund.isStored) {
      store.commit('addFund', { fundcode: fund.fundcode, hold: true })
      fund.isStored = true
    } else {
      store.commit('updateFund', { fundcode: fund.fundcode, hold: false })
    }
  }

  return { suggestions, fetchSuggestions, toggleStored, toggleHold }
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()
    const keyword = ref('')
    const inputRef: Ref<any> = ref(null)
    const {
      suggestions,
      fetchSuggestions,
      toggleStored,
      toggleHold
    } = useSuggestion(300, store)

    onMounted(() => {
      inputRef.value.focus()
    })

    function goBack() {
      router.replace('/')
    }

    return {
      keyword,
      goBack,
      suggestions,
      fetchSuggestions,
      inputRef,
      toggleStored,
      toggleHold
    }
  }
})
</script>

<style lang="scss" scoped>
.input-row {
  padding: 10px 10px;
}

.suggestion-list {
  padding: 0 10px;

  .suggestion-item {
    margin: 4px 0;

    .switch-label {
      font-size: 13px;
      margin-right: 5px;
      color: grey;
    }
  }
}
</style>
