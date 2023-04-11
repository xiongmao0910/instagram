// Import library
import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

// Import components
import {
    getUserByToken,
    createUserWithFormData,
    signInWithFormData,
    getProfile,
    updateProfile,
    follow,
} from '../api';
import { refreshTokenFunction } from '../utils';

// Create context
const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Create provider
export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState();

    // Method
    async function getUser() {
        let token = localStorage.getItem('token');
        if (token) {
            // TODO Check token is valid
            const date = new Date();
            const decodedToken = jwt_decode(token);

            // TODO Refresh token
            if (decodedToken.exp < date.getTime() / 1000) {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await refreshTokenFunction(refreshToken);
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);

                // TODO update token
                token = response.token;
            }

            // TODO Fetch user data with token
            const { success, msg, data } = await getUserByToken(token);

            if (success) {
                // TODO Set currentUser state
                setCurrentUser(data);
                setLoading(false);
                return;
            }

            // TODO Console log error message
            console.log(msg);
        }

        // TODO Set loading state
        setLoading(false);
    }

    async function signup(formData) {
        const { success, msg } = await createUserWithFormData(formData);

        if (success) {
            // TODO Notification: register successfully
            console.log(msg);
            return true;
        }

        // TODO Notification: register failed
        console.log(msg);
        return false;
    }

    async function login(formData) {
        const { success, msg, token, refreshToken, data } =
            await signInWithFormData(formData);
        if (success) {
            // TODO Notification: sign in successfully
            console.log(msg);

            // TODO Set currentUser state
            setCurrentUser(data);

            // TODO Save accessToken and refreshToken in localstorage
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            return true;
        }

        // TODO Notification: login failed
        console.log(msg);
        return false;
    }

    async function signout() {
        // TODO Remove token in localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // TODO Set data user null
        setCurrentUser(null);

        // TODO Notification: logout successfully
        console.log('logout successfully');
    }

    async function getUserByUsername(username, id) {
        const { success, msg, data } = await getProfile(
            `/user/get/${username}`,
            id
        );

        // TODO Return data from api
        return {
            success,
            data,
            msg,
        };
    }

    async function updateUser(formData) {
        const { success, msg, data } = await updateProfile(formData);

        if (success) {
            // TODO Notification: update profile successfully
            console.log(msg);
            // TODO Set currentUser state
            setCurrentUser(data);

            return true;
        }

        // TODO Notification: update profile failed
        console.log(msg);
        return false;
    }

    async function followUser(clientData) {
        const { success, msg, data } = await follow(clientData);

        if (success) {
            // TODO Notification: follow user successfully
            console.log(msg);

            if (data.followingCount >= 0 && data.followerCount >= 0) {
                // TODO Set followingCount of currentUser
                setCurrentUser((prev) => {
                    return {
                        ...prev,
                        followingCount: data.followingCount,
                    };
                });

                // TODO Return follower count and update to UI
                return {
                    followerCount: data.followerCount,
                    isFollowed: data.isFollowed,
                };
            }

            return {
                isFollowedReq: data.isFollowedReq,
            };
        }

        // TODO Notification: follow user failed
        console.log(msg);
        return;
    }

    // Side effect
    useEffect(() => {
        getUser();
    }, []);

    // Props
    const value = {
        currentUser,
        signup,
        login,
        signout,
        getUserByUsername,
        updateUser,
        followUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
