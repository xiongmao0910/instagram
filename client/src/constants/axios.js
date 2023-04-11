// Import library
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Import components
import { refreshTokenFunction } from '../utils';

const publishInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'foobar',
    },
});

const privateInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'foobar',
    },
});

privateInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const date = new Date();
        const decodedToken = jwt_decode(token);

        if (decodedToken.exp < date.getTime() / 1000) {
            const response = await refreshTokenFunction(refreshToken);
            console.log(response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
        }

        return config;
    },
    (err) => Promise.reject(err)
);

export { publishInstance, privateInstance };
