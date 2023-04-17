// Import library
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddUser } from '@icon-park/react';

// Import components
import { useAuth } from '../contexts';
import { getFollowReq, followReq } from '../api';

const FollowerReq = () => {
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [followerReqs, setFollowerReqs] = useState();

    /**
     * Method
     */
    async function getFollowRequest() {
        const { success, msg, data } = await getFollowReq(currentUser.id);

        if (!success) {
            // TODO Notification
            console.log(msg);
        }

        if (success) {
            setFollowerReqs(data);
        }

        setLoading(false);
    }

    /**
     * Handle event
     */
    async function handleFollowReq({ accept, followingId }) {
        const dataBody = {
            followerId: currentUser.id,
            followingId,
            accept,
        };

        const { success, msg } = await followReq(dataBody);
        // TODO Notification
        console.log(msg);

        if (success) {
            // TODO Update list in UI
            setFollowerReqs((prev) => {
                return prev.filter((i) => i.id !== followingId);
            });
        }
    }

    /**
     * Side effect
     */
    useEffect(() => {
        getFollowRequest();
    }, []);

    if ((!currentUser.private || !followerReqs) && !loading) {
        return (
            <section className="section">
                <div className="section-container">
                    <h1>404 page</h1>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <section className="section">
            <div
                className="section-container"
                style={{ '--width-section': '30rem' }}
            >
                <div className="flow">
                    <div className="fs-500 fw-bold">Follow requests</div>
                    <div className="flow">
                        <div className="list">
                            {followerReqs.length > 0 &&
                                followerReqs.map((req) => (
                                    <div
                                        className="list-item bg-white"
                                        style={{ borderRadius: '0.25rem' }}
                                        key={req.id}
                                    >
                                        <div className="list-info">
                                            <Link
                                                to={`/${req.username}/`}
                                                className="list-img"
                                            >
                                                <img
                                                    src={req.photoURL}
                                                    alt={req.fullname}
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div
                                                className="d-flex items-center"
                                                style={{
                                                    '--gap': '1rem',
                                                    flex: '1',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 'min(100%, 24rem)',
                                                    }}
                                                >
                                                    <Link
                                                        to={`/${req.username}/`}
                                                        className="fw-bold"
                                                    >
                                                        {req.username}
                                                    </Link>
                                                    <p>{req.fullname}</p>
                                                </div>
                                                <button
                                                    button-variant="contained"
                                                    button-color="blue"
                                                    onClick={() =>
                                                        handleFollowReq({
                                                            accept: true,
                                                            followingId: req.id,
                                                        })
                                                    }
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    button-variant="contained"
                                                    onClick={() =>
                                                        handleFollowReq({
                                                            accept: false,
                                                            followingId: req.id,
                                                        })
                                                    }
                                                >
                                                    delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {followerReqs.length === 0 && (
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
                                        Follower Requests
                                    </div>
                                    <p>
                                        When people ask to follow you, you'll
                                        see their requests here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FollowerReq;
