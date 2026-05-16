import axios from "axios"

const api = axios.create()

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response ){
            if(error.response.status === 401){
                localStorage.removeItem('token')
                window.location.href = '/login'
            } else if (error.response.status === 403) {
                alert('You don\'t have permission to do that')
            } else if (error.response.status === 404) {
                alert('Resource not found')
            }
        }

        return Promise.reject(error)
    }
)

let token = null
const setToken = (newToken) => {
    if (newToken) {
        token = `Bearer ${newToken}`
    } else {
        token = null
    }
}

api.interceptors.request.use((config) => {
    if (token) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = token
    }
    return config
})

export default api
export { setToken }