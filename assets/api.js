import axios from 'axios'

export const api = axios.create({
    baseURL: "https://garchi.co.uk/api/v1/",
    headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        Accept: "application/json"
    }
})

export const localapi = axios.create({
    baseURL: "http://localhost:3000/api",
    headers:{
        Accept: "application/json"
    }
})