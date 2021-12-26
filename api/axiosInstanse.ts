import axios, { AxiosInstance } from 'axios'

const getAxiosInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  /*
  https://blog.bitsrc.io/setting-up-axios-interceptors-for-all-http-calls-in-an-application-71bc2c636e4e
  */
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // eslint-disable-next-line no-console
      console.log(`The error has occurred: ${String(error)}`)
      return Promise.reject(error)
    }
  )
  return axiosInstance
}

export default getAxiosInstance
