import axios, { AxiosError } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export type ApiError = {
  message?: string
  status?: number
  details?: any
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const responseData = error?.response?.data as any
    const data: ApiError = {
      message: responseData?.message || error.message,
      status: error?.response?.status,
      details: responseData,
    }
    return Promise.reject(data)
  }
)

export default api
