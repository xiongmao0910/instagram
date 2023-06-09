// Import library
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddUser } from '@icon-park/react';

// Import components
import Modal from './Modal';
import { getFollower, getFollowing } from '../api';

const FollowModal = ({ username, title, type, setModal }) => {
    const [follows, setFollows] = useState();
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    /**
     * Method
     */
    async function getFollow() {
        if (type === 'follower') {
            const { success, msg, data } = await getFollower(username);

            if (!success) {
                // TODO Notification: user not valid
                console.log(msg);

                // TODO Hide follower list modal
                setModal(false);

                return;
            }

            setFollows(data);
        }

        if (type === 'following') {
            const { success, msg, data } = await getFollowing(username);

            if (!success) {
                // TODO Notification: user not valid
                console.log(msg);

                // TODO Hide follower list modal
                setModal(false);

                return;
            }

            setFollows(data);
        }

        setLoading(false);
    }

    function handleGoProfile(username) {
        // TODO Hide follow modal
        setModal(false);

        // TODO Go to profile of follow user
        navigate(`/${username}/`);
    }

    /**
     * Side effect
     */
    useEffect(() => {
        getFollow();
    }, []);

    return (
        <Modal title={title} isIcon={true} setModal={setModal}>
            {loading && <p>Loading...</p>}
            {!loading && (
                <>
                    {follows.length === 0 && (
                        <div
                            className="flow"
                            style={{
                                textAlign: 'center',
                                paddingBlock: '2rem',
                            }}
                        >
                            <div className="fs-600">
                                <AddUser />
                            </div>
                            <div className="fs-400 fw-bold">
                                {type === 'follower'
                                    ? 'Followers'
                                    : 'People you follow'}
                            </div>
                            <p>
                                {type === 'follower'
                                    ? "You'll see all the people who follow you here."
                                    : "Once you follow people, you'll see them here."}
                            </p>
                        </div>
                    )}
                    {follows.length > 0 && (
                        <div className="list">
                            {follows.map((follow) => (
                                <div className="list-item" key={follow.id}>
                                    <div className="list-info">
                                        <div
                                            className="list-img"
                                            onClick={() =>
                                                handleGoProfile(follow.username)
                                            }
                                        >
                                            <img
                                                src={follow.photoURL}
                                                alt={follow.fullname}
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div>
                                            <p
                                                className="fw-bold"
                                                onClick={() =>
                                                    handleGoProfile(
                                                        follow.username
                                                    )
                                                }
                                            >
                                                {follow.username}
                                            </p>
                                            <p>{follow.fullname}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
};

export default FollowModal;
