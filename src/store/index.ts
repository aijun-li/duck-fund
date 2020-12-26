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
        state.funds = storedFunds.split(',').map((fundcode: string) => ({
          fundcode
        }))
      }
    },
    // update the existing fund
    updateFund(state, price: StockPrice) {
      const index = state.funds.findIndex(
        item => item.fundcode === price.fundcode
      )
      state.funds.splice(index, 1, price)
    }
  },
  actions: {}
})

export function useStore() {
  return baseUseStore(key)
}
