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

async function likePost(uri, data) {
    try {
        const response = await privateInstance.post(
            `/post/${uri}`,
            JSON.stringify(data)
        );

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function getListUserLikePost(id) {
    try {
        const response = await privateInstance.get(`/post/list-like/${id}`);

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function commentPost(data) {
    try {
        const response = await privateInstance.post(
            '/post/comment',
            JSON.stringify(data)
        );

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function editPost(data) {
    try {
        const response = await privateInstance.put(
            `/post/edit`,
            JSON.stringify(data)
        );

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function deletePost(id) {
    try {
        const response = await privateInstance.delete(`/post/delete/${id}`);

        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export {
    getAllPost,
    getPost,
    createPost,
    likePost,
    getListUserLikePost,
    commentPost,
    editPost,
    deletePost,
};
