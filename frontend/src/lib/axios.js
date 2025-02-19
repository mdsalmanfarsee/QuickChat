import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api',
    //baseURL: 'https://quick-chat-backend-murex.vercel.app/api',
    withCredentials: true,
})