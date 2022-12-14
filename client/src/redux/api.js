import axios from 'axios'

const instanceApi = axios.create({
    baseURL: 'http://localhost:5000'
})

instanceApi.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
})

export default instanceApi;
