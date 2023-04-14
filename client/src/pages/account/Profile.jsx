// Import library
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GridNine, VideoTwo, PeopleBottomCard } from '@icon-park/react';

// Import components
import { useAuth } from '../../contexts';
import defaultAvatar from '../../assets/default_avatar.jpg';
import { Modal, PostGallery, FollowModal } from '../../components';
import { convertImageToBase64 } from '../../utils';
import { getAllPost } from '../../api';

const Profile = () => {
    // TODO Get username on URL -> domain/:username/
    const { username } = useParams();

    const { currentUser, getUserByUsername, updateUser, followUser } =
        useAuth();

    const avatarRef = useRef();

    const [loading, setLoading] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenFollowerModal, setIsOpenFollowerModal] = useState(false);
    const [isOpenFollowingModal, setIsOpenFollowingModal] = useState(false);
    const [page, setPage] = useState('posts');
    const [user, setUser] = useState();
    const [posts, setPosts] = useState();

    /**
     * Method
     */
    async function getInfo(uname) {
        let userId = currentUser.id;
        // TODO Check if your info page
        if (currentUser && currentUser.username !== uname) {
            const { success, msg, data } = await getUserByUsername(
                uname,
                currentUser.id
            );

            // TODO Check user is valid?
            if (success) {
                // TODO Save data user
                setUser(data);
                userId = data.id;
            } else {
                // TODO Notification: user not found
                console.log(msg);
            }
        }

        if (user && currentUser.username === uname && user.username !== uname) {
            // TODO Save data user
            setUser(currentUser);
        }

        // TODO Save posts of user
        const { data } = await getAllPost(userId);
        setPosts(data);

        setLoading(false);
    }

    /**
     * Handle event
     */
    function handleClickAvatar() {
        // TODO Check if it's your profile
        if (user.username !== currentUser.username) {
            return;
        }

        // TODO Show modal
        setIsOpenModal(true);
    }

    function handleOpenFile() {
        avatarRef.current.click();
    }

    async function handleFileChange() {
        // TODO Convert image to base 64
        const imgToBase64 = await convertImageToBase64(
            avatarRef.current.files[0]
        );

        // TODO Check image is exists
        if (user.photoURL === imgToBase64) {
            console.log('Image is a avatar');
            return;
        }

        // TODO Define formData
        const formData = {
            id: user.id,
            photoURL: imgToBase64,
        };

        await updateUser(formData);

        // TODO Hide modal
        setIsOpenModal(false);
    }

    async function handleFollowClick() {
        const data = {
            isFollowed: user.isFollowed,
            followerId: user.id,
            followingId: currentUser.id,
            isPrivate: user.private,
            isFollowedReq: user.isFollowedReq,
        };

        const response = await followUser(data);

        if (response.followerCount >= 0) {
            setUser((prev) => {
                return {
                    ...prev,
                    followerCount: response.followerCount,
                    isFollowed: response.isFollowed,
                };
            });
        } else {
            setUser((prev) => {
                return {
                    ...prev,
                    isFollowedReq: response.isFollowedReq,
                };
            });
        }
    }

    async function handleShowFollowerList() {
        if (currentUser.username !== user.username && !user.isFollowed) {
            console.log('you cant see user follower list');
            return;
        }

        setIsOpenFollowerModal(true);
    }

    async function handleShowFollowingList() {
        if (currentUser.username !== user.username && !user.isFollowed) {
            console.log('you cant see user follower list');
            return;
        }

        setIsOpenFollowingModal(true);
    }

    /**
     * Side effect
     */
    useEffect(() => {
        getInfo(username);
    }, [username]);

    useEffect(() => {
        if (currentUser.username === username) {
            setUser(currentUser);
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!user) {
        return (
            <section className="section">
                <div className="section-container">
                    <h1>404 page</h1>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="section">
                <div className="section-container">
                    <div className="profile">
                        <header className="profile-header d-flex">
                            <div
                                className="profile-avatar"
                                onClick={handleClickAvatar}
                            >
                                <img
                                    className={`${
                                        user.username ===
                                            currentUser.username &&
                                        'profile-avatar-img'
                                    }`}
                                    src={
                                        user.photoURL
                                            ? user.photoURL
                                            : defaultAvatar
                                    }
                                    alt={user.username}
                                />
                            </div>
                            {user.username === currentUser.username && (
                                <input
                                    type="file"
                                    id="file"
                                    ref={avatarRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            )}
                            <div className="profile-info flow">
                                <div className="d-flex items-center profile-info-top">
                                    <div className="profile-username">
                                        {user.username}
                                    </div>
                                    {user.username === currentUser.username && (
                                        <Link
                                            to="/accounts/edit/"
                                            className="button"
                                            button-variant="contained"
                                        >
                                            edit profile
                                        </Link>
                                    )}
                                    {user.username !== currentUser.username &&
                                        !user.isFollowedReq &&
                                        user.isFollowed && (
                                            <button
                                                button-variant="contained"
                                                onClick={handleFollowClick}
                                            >
                                                following
                                            </button>
                                        )}
                                    {user.username !== currentUser.username &&
                                        !user.isFollowedReq &&
                                        !user.isFollowed && (
                                            <button
                                                button-variant="contained"
                                                button-color="blue"
                                                onClick={handleFollowClick}
                                            >
                                                follow
                                            </button>
                                        )}
                                    {user.username !== currentUser.username &&
                                        user.isFollowedReq && (
                                            <button
                                                button-variant="contained"
                                                onClick={handleFollowClick}
                                            >
                                                request
                                            </button>
                                        )}
                                </div>
                                <div className="profile-count d-flex items-center">
                                    <div className="profile-count-post">
                                        {posts.postCount} posts
                                    </div>
                                    <div
                                        className="profile-count-follower"
                                        data-cursor={
                                            currentUser.username ===
                                                user.username || user.isFollowed
                                                ? 'true'
                                                : ''
                                        }
                                        onClick={handleShowFollowerList}
                                    >
                                        {user.followerCount} follower
                                    </div>
                                    <div
                                        className="profile-count-following"
                                        data-cursor={
                                            currentUser.username ===
                                                user.username || user.isFollowed
                                                ? 'true'
                                                : ''
                                        }
                                        onClick={handleShowFollowingList}
                                    >
                                        {user.followingCount} following
                                    </div>
                                </div>
                                <div>
                                    <p className="fw-bold">{user.fullname}</p>
                                    {user.bio && <p>{user.bio}</p>}
                                </div>
                            </div>
                        </header>
                        <div className="profile-main">
                            {(user.username === currentUser.username ||
                                !user.private) && (
                                <>
                                    <div className="profile-menu d-flex justify-center items-center">
                                        <div
                                            className={`profile-menu-item ${
                                                page === 'posts' ? 'active' : ''
                                            }`}
                                        >
                                            <GridNine />
                                            <p>posts</p>
                                        </div>
                                        <div className="profile-menu-item">
                                            <VideoTwo />
                                            <p>reels</p>
                                        </div>
                                        <div className="profile-menu-item">
                                            <PeopleBottomCard />
                                            <p>tagged</p>
                                        </div>
                                    </div>
                                    {page === 'posts' && (
                                        <PostGallery posts={posts.posts} />
                                    )}
                                </>
                            )}
                            {user.id !== currentUser.id && user.private && (
                                <div className="profile-private flow">
                                    <p className="text-small">
                                        This Account is Private
                                    </p>
                                    <p className="text-small">
                                        Follow to see their photos and videos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {isOpenModal && (
                <Modal title="change profile photo">
                    <p
                        onClick={handleOpenFile}
                        className="fw-bold text-blue-500"
                    >
                        upload photo
                    </p>
                    <p
                        className="fw-bold text-red-500"
                        onClick={() => setIsOpenModal(false)}
                    >
                        cancel
                    </p>
                </Modal>
            )}
            {isOpenFollowerModal && (
                <FollowModal
                    username={user.username}
                    title="followers"
                    type="follower"
                    setModal={setIsOpenFollowerModal}
                />
            )}
            {isOpenFollowingModal && (
                <FollowModal
                    username={user.username}
                    title="following"
                    type="following"
                    setModal={setIsOpenFollowingModal}
                />
            )}
        </>
    );
};

export default Profile;
