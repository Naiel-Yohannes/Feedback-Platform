import api from './interceptor'
const baseURL = '/api/login'

const login = async (credentials) => {
    const response = await api.post(baseURL, credentials)
    return response.data
}

export default { login }