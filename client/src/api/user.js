import { privateInstance } from '../constants';

async function getProfile(uri, id) {
    try {
        const response = await privateInstance.get(uri, {
            headers: {
                currentUserId: id,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function updateProfile(formData) {
    try {
        const response = await privateInstance.put(
            '/user/update',
            JSON.stringify(formData)
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function follow({
    isFollowed,
    followerId,
    followingId,
    isPrivate,
    isFollowedReq,
}) {
    const uri = `/user/${isFollowed || isFollowedReq ? 'unfollow' : 'follow'}`;

    try {
        const response = await privateInstance.put(
            uri,
            JSON.stringify({
                followerId,
                followingId,
                isPrivate,
                isFollowedReq,
            })
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function getFollower(username) {
    try {
        const response = await privateInstance.get(
            `/user/get-follower/${username}`
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function getFollowing(username) {
    try {
        const response = await privateInstance.get(
            `/user/get-following/${username}`
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function getFollowReq(id) {
    try {
        const response = await privateInstance.get('/user/get-request', {
            headers: {
                currentUserId: id,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function followReq(data) {
    try {
        const response = await privateInstance.put(
            '/user/follow-request',
            JSON.stringify(data)
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function searchUser(data) {
    try {
        const response = await privateInstance.post(
            '/user/search',
            JSON.stringify(data)
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export {
    getProfile,
    updateProfile,
    follow,
    getFollower,
    getFollowing,
    getFollowReq,
    followReq,
    searchUser,
};
