// Import library
import { useEffect, useState } from 'react';

// Import components
import Modal from './Modal';
import { getListUserLikePost } from '../api';

const LikeModal = ({ postId, setIsOpen, handleGoProfile }) => {
    const [likes, setLikes] = useState();
    const [loading, setLoading] = useState(true);

    /**
     * Method
     */
    async function getListLike() {
        const { success, msg, data } = await getListUserLikePost(postId);

        if (!success) {
            // TODO Notification: Something went wrong
            console.log(msg);

            // TODO Close modal
            setIsOpen(false);
            return;
        }

        // TODO Save list user like of post
        setLikes(data.likes);

        setLoading(false);
    }

    /**
     * Side effect
     */
    useEffect(() => {
        getListLike();
    }, []);

    return (
        <Modal title="likes" isIcon={true} setModal={setIsOpen}>
            {loading && <p>Loading...</p>}
            {!loading && (
                <div className="list">
                    {likes.map((like) => (
                        <div className="list-item" key={like.id}>
                            <div className="list-info">
                                <div
                                    className="list-img"
                                    onClick={() =>
                                        handleGoProfile(like.username)
                                    }
                                >
                                    <img
                                        src={like.photoURL}
                                        alt={like.fullname}
                                        className="img-fluid"
                                    />
                                </div>
                                <div>
                                    <p
                                        className="fw-bold"
                                        onClick={() =>
                                            handleGoProfile(like.username)
                                        }
                                    >
                                        {like.username}
                                    </p>
                                    <p>{like.fullname}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default LikeModal;
