import axios from "axios"

const api = axios.create()

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response ){
            if(error.response.status === 401){
                window.dispatchEvent(new Event('unauthorized'))
            } else if (error.response.status === 403) {
                window.dispatchEvent(new Event('forbidden'))
            } else if (error.response.status === 404) {
                window.dispatchEvent(new Event('notfound'))
            }
        }

        return Promise.reject(error)
    }
)

let token = null
const setToken = (newToken) => {
    token = `Bearer ${newToken}`
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