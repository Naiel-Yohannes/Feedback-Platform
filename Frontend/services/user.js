import api from './interceptor'
const url = import.meta.env.VITE_API_URL
const baseURL = `${url}/api/users`

const createUser = async (user) => {
    const response = await api.post(baseURL, user)
    return response.data
}

export default { createUser }