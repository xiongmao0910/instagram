import { publishInstance } from '../constants';

async function refreshTokenFunction(refreshToken) {
    try {
        const response = await publishInstance.post(
            '/auth/refresh',
            JSON.stringify({ refreshToken })
        );

        const data = response.data;
        console.log('refreshing');
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default refreshTokenFunction;
