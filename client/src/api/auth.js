import { publishInstance, privateInstance } from '../constants';

async function getUserByToken(token) {
    try {
        const response = await privateInstance.post(
            '/user',
            JSON.stringify({ token })
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function createUserWithFormData(formData) {
    try {
        const response = await publishInstance.post(
            '/auth/register',
            JSON.stringify(formData)
        );
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function signInWithFormData(formData) {
    try {
        const response = await publishInstance.post(
            '/auth/login',
            JSON.stringify(formData)
        );
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export { getUserByToken, createUserWithFormData, signInWithFormData };
