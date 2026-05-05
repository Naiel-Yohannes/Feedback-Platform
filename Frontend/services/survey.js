import api from './interceptor'
const baseURL = '/api/survey'

const getAllSurveys = async () => {
    const response = await api.get(baseURL)
    return response.data
}

const getSurvey = async (id) => {
    const response = await api.get(`${baseURL}/${id}`)
    return response.data
}

const createSurvey = async (survey) => {
    const response = await api.post(baseURL, survey)
    return response.data
}

const updateSurvey = async (id, survey) => {
    const response = await api.put(`${baseURL}/${id}`, survey)
    return response.data
}

const deleteSurvey = async (id) => {
    const response = await api.delete(`${baseURL}/${id}`)
    return response.data
}

export default { getAllSurveys, getSurvey, createSurvey, updateSurvey, deleteSurvey }