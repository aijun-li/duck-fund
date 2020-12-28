<template>
  <el-row class="input-row" type="flex" justify="space-between">
    <el-col :span="19">
      <el-input
        v-model="keyword"
        placeholder="请输入基金代码、名称或简拼"
        @keyup="fetchSuggestions(keyword)"
        ref="inputRef"
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
          <el-button
            v-if="suggestion.isStored"
            circle
            icon="el-icon-check"
            type="info"
            @click="addOrRemove(suggestion)"
          ></el-button>
          <el-button
            v-else
            circle
            icon="el-icon-plus"
            @click="addOrRemove(suggestion)"
          ></el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import StockPrice from '@/interfaces/StockPrice'
import { AxiosStatic } from 'axios'
import { defineComponent, inject, onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { State, useStore } from '@/store'
import { Store } from 'vuex'

function autoSuggest(delay: number, axios: AxiosStatic, store: Store<State>) {
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
          ) !== -1
      }))
    }, delay)
  }

  function addOrRemove(item: StockPrice) {
    if (item.isStored) {
      store.commit('removeFund', { fundcode: item.fundcode })
      item.isStored = false
    } else {
      store.commit('addFund', { fundcode: item.fundcode })
      item.isStored = true
    }
  }

  return { suggestions, fetchSuggestions, addOrRemove }
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const axios = inject<AxiosStatic>('axios')!
    const store = useStore()
    const keyword = ref('')
    const inputRef: Ref<any> = ref(null)
    const { suggestions, fetchSuggestions, addOrRemove } = autoSuggest(
      300,
      axios,
      store
    )

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
      addOrRemove,
      inputRef
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
    margin: 5px 0;
  }
}
</style>
