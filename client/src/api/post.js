import { privateInstance } from '../constants';

async function getAllPost(userId) {
    try {
        const response = await privateInstance.get(`/post/get-all/${userId}`);

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function getPost(postId, userId) {
    try {
        const response = await privateInstance.get(`/post/get/${postId}`, {
            headers: {
                currentUserId: userId,
            },
        });

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

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

export { getAllPost, getPost, createPost };
