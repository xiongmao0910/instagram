import { privateInstance } from '../constants';

async function createPost(data) {
    try {
        const response = await privateInstance.post(
            '/post/create',
            JSON.stringify(data)
        );

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export { createPost };
