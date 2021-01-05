import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import StockPrice from '@/interfaces/StockPrice'

export interface State {
  funds: StockPrice[]
}

export const key: InjectionKey<Store<State>> = Symbol()

export default createStore({
  state: {
    funds: [] as StockPrice[]
  },
  mutations: {
    // intialize the funds array with data from localStorage
    initializeFunds(state) {
      const storedFunds = localStorage.getItem('storedFunds')
      if (storedFunds) {
        state.funds = storedFunds.split(',').map((fund: string) => ({
          fundcode: fund.split('|')[0],
          hold: JSON.parse(fund.split('|')[1])
        }))
      }
    },
    // update the existing fund
    updateFund(state, fund: StockPrice) {
      const index = state.funds.findIndex(
        item => item.fundcode === fund.fundcode
      )
      const shouldSave = fund.hold !== state.funds[index].hold

      for (const property in fund) {
        state.funds[index][property] = fund[property]
      }

      if (shouldSave) {
        localStorage.setItem(
          'storedFunds',
          state.funds.map(fund => `${fund.fundcode}|${fund.hold}`).join(',')
        )
      }
    },
    // add new fund
    addFund(state, fund: StockPrice) {
      state.funds.push(fund)
      localStorage.setItem(
        'storedFunds',
        state.funds.map(fund => `${fund.fundcode}|${fund.hold}`).join(',')
      )
    },
    // remove existing fund
    removeFund(state, payload) {
      const index = state.funds.findIndex(
        fund => fund.fundcode === payload.fundcode
      )
      state.funds.splice(index, 1)
      localStorage.setItem(
        'storedFunds',
        state.funds.map(fund => `${fund.fundcode}|${fund.hold}`).join(',')
      )
    }
  },
  actions: {}
})

export function useStore() {
  return baseUseStore(key)
}
