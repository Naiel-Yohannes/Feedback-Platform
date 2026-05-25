import api from './interceptor'
const url = import.meta.env.VITE_API_URL
const baseURL = `${url}/api/responses`

const getResponse = async (id) => {
    const response = await api.get(`${baseURL}/survey/${id}`)
    return response.data
}

const submitResponse = async (response) => {
    const res = await api.post(baseURL, response)
    return res.data
}

export default { getResponse, submitResponse}