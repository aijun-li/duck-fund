import axios from 'axios'
import axiosRetry from 'axios-retry'

const instance = axios.create({
  timeout: 1000
})

axiosRetry(instance, {
  retries: 3
})

export default instance
