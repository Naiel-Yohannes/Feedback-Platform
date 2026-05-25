import api from './interceptor'
const url = import.meta.env.VITE_API_URL
const baseURL = `${url}/api/login`

const login = async (credentials) => {
    const response = await api.post(baseURL, credentials)
    return response.data
}

export default { login }