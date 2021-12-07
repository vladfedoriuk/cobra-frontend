import axios, { AxiosInstance } from 'axios'

const getAxiosInstance = (): AxiosInstance =>
  axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

export default getAxiosInstance
