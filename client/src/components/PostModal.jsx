// Import library
import { useEffect, useState, useRef } from 'react';
import { More, Like, Comments, Share, Label } from '@icon-park/react';

// Import components
import { getPost } from '../api';
import { useAuth } from '../contexts';
import Slide from './Slide';

const PostModal = ({ id }) => {
    const { currentUser } = useAuth();

    const commentRef = useRef();

    const [post, setPost] = useState();
    const [collapse, setCollapse] = useState(false);
    const [loading, setLoading] = useState(true);

    /**
     * Method
     */
    async function getPostData(id) {
        const { success, msg, data } = await getPost(id, currentUser.id);

        if (success) {
            setPost(data);
        }

        if (!success) {
            // TODO Notification: post not found
            console.log(msg);
        }

        setLoading(false);
    }

    /**
     * Side effect
     */
    useEffect(() => {
        getPostData(id);
    }, [id]);

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!post) {
        return (
            <div>
                <h1>404 page</h1>
            </div>
        );
    }

    return (
        <div className="post">
            <div className="post-media">
                <Slide media={post.media} />
            </div>
            <div className="post-content">
                <div className="post-header d-flex justify-between items-center">
                    <div className="post-author d-flex items-center">
                        <div className="post-avatar">
                            <img
                                src={post.userPhotoURL}
                                alt={post.username}
                                className="img-fluid"
                            />
                        </div>
                        <p className="post-username fw-bold">{post.username}</p>
                    </div>
                    {post.username === currentUser.username && (
                        <div className="dropdown">
                            <div
                                className="dropdown-toggle"
                                onClick={() => setCollapse(!collapse)}
                            >
                                <More />
                            </div>
                            <div
                                className="dropdown-menu"
                                data-collapse={collapse}
                            >
                                <div className="dropdown-item text-red-500">
                                    delete
                                </div>
                                <div className="dropdown-item">edit</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="post-comments">
                    {!post.comments.length && !post.caption.length && (
                        <div
                            style={{ height: '100%' }}
                            className="d-flex flex-column justify-center items-center"
                        >
                            <div className="fs-400 fw-bold">
                                No comments yet.
                            </div>
                            <p>Start the conversation.</p>
                        </div>
                    )}
                    {post.caption && (
                        <div className="post-caption flow">
                            <div className="post-author d-flex items-center">
                                <div className="post-avatar">
                                    <img
                                        src={post.userPhotoURL}
                                        alt={post.username}
                                        className="img-fluid"
                                    />
                                </div>
                                <p className="post-username fw-bold">
                                    {post.username}
                                </p>
                            </div>
                            <div>
                                <div>{post.caption}</div>
                                <small>{post.createdAt}</small>
                            </div>
                        </div>
                    )}
                </div>
                <div className="post-action">
                    <div className="post-action-icon d-flex justify-between items-center">
                        <div className="d-flex">
                            <div className="post-icon">
                                <Like theme={post.isLiked ? 'filled' : ''} />
                            </div>
                            <div className="post-icon">
                                <Comments />
                            </div>
                            <div className="post-icon">
                                <Share />
                            </div>
                        </div>
                        <div className="post-icon">
                            <Label />
                        </div>
                    </div>
                    <div>
                        <p className="fw-bolds">{post.likeCount} likes</p>
                        <small>{post.createdAt}</small>
                    </div>
                </div>
                <div className="post-controls d-flex items-center">
                    <input
                        type="text"
                        id="comment"
                        name="comment"
                        ref={commentRef}
                        placeholder="Add a comment..."
                    />
                    <div className="text-blue-400 fw-bold">post</div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
