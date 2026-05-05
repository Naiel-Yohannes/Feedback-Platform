import api from './interceptor'
const baseURL = '/api/responses'

const getResponse = async (id) => {
    const response = await api.get(`${baseURL}/${id}`)
    return response.data
}

const submitResponse = async (response) => {
    const res = await api.post(baseURL, response)
    return res.data
}

export default { getResponse, submitResponse}