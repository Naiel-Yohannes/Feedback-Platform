import api from './interceptor'
const baseURL = '/api/users'

const createUser = async (user) => {
    const response = await api.post(baseURL, user)
    return response.data
}

export default { createUser }