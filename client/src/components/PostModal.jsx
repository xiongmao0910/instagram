// Import library
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { More, Like, Comments, Share, Label } from '@icon-park/react';

// Import components
import { getPost, likePost, commentPost, editPost, deletePost } from '../api';
import { useAuth } from '../contexts';
import Slide from './Slide';
import Modal from './Modal';
import LikeModal from './LikeModal';

const PostModal = ({ id, setModalData }) => {
    const { currentUser } = useAuth();

    const commentRef = useRef();
    const captionRef = useRef();

    const navigate = useNavigate();

    const [post, setPost] = useState();
    const [collapse, setCollapse] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);

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
     * Handle event
     */
    async function handleLikePost() {
        const api_uri = post.isLiked ? 'unlike' : 'like';

        const bodyData = {
            userId: currentUser.id,
            postId: post._id,
        };

        const { success, msg, data } = await likePost(api_uri, bodyData);

        if (success) {
            // TODO Update Post Modal UI
            setPost((prev) => {
                return {
                    ...prev,
                    likeCount: data.likeCount,
                    isLiked: data.isLiked,
                };
            });
        }

        // TODO Notification
        console.log(msg);
    }

    function handleShowLikeList() {
        if (!post.likeCount) {
            return;
        }

        setIsOpen(true);
    }

    function handleGoProfile(username) {
        if (post.username === username) {
            return;
        }

        // TODO Hide list user like a post modal
        if (isOpen) {
            setIsOpen(false);
        }

        // TODO Hide modal post detail
        setModalData((prev) => {
            return {
                ...prev,
                isOpen: false,
                postId: '',
            };
        });

        // TODO Go to profile of follow user
        navigate(`/${username}/`);
    }

    function handleChange() {
        if (
            commentRef.current.value &&
            document
                .querySelector('#comment-post')
                .getAttribute('data-visible') === 'false'
        ) {
            document
                .querySelector('#comment-post')
                .setAttribute('data-visible', 'true');
        }

        if (
            !commentRef.current.value &&
            document
                .querySelector('#comment-post')
                .getAttribute('data-visible') === 'true'
        ) {
            document
                .querySelector('#comment-post')
                .setAttribute('data-visible', 'false');
        }
    }

    async function handleCommentPost() {
        const formData = {
            postId: post._id,
            userId: currentUser.id,
            description: commentRef.current.value,
        };

        const { success, msg, data } = await commentPost(formData);

        // TODO Notification
        console.log(msg);

        if (success) {
            // TODO Update comment data
            setPost((prev) => {
                return {
                    ...prev,
                    comments: [...prev.comments, data],
                };
            });
        }

        // TODO Reset input value
        commentRef.current.value = '';
    }

    function handleShowEditModal() {
        // TODO Show edit modal
        setIsOpenEdit(true);

        setCollapse(false);
    }

    function handleCaptionChange() {
        if (post.caption === captionRef.current.value) {
            document
                .querySelector('#editBtn')
                .setAttribute('data-visible', 'false');
        }

        if (post.caption !== captionRef.current.value) {
            document
                .querySelector('#editBtn')
                .setAttribute('data-visible', true);
        }
    }

    async function handleEdit() {
        const caption = captionRef.current.value;

        const { success, msg } = await editPost({ id: post._id, caption });

        if (success) {
            // TODO Notification
            console.log(msg);

            // TODO Update post state
            setPost((prev) => {
                return {
                    ...prev,
                    caption,
                };
            });

            // TODO Hide modal edit
            setIsOpenEdit(false);
        }

        if (!success) {
            // TODO Notification
            console.log(msg);

            captionRef.current.focus();
        }
    }

    async function handleDelete() {
        const { success, msg } = await deletePost(post._id);

        if (success) {
            // TODO Notification
            console.log(msg);

            // TODO Reload page
            window.location.reload(true);
        }

        if (!success) {
            // TODO Notification
            console.log(msg);
        }
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
        <>
            <article className="post">
                <div className="post-media">
                    <Slide media={post.media} />
                </div>
                <div className="post-content">
                    <div className="post-header d-flex justify-between items-center">
                        <div className="post-author d-flex items-center">
                            <div className="post-avatar cursor-pointer">
                                <img
                                    src={post.userPhotoURL}
                                    alt={post.username}
                                    className="img-fluid"
                                />
                            </div>
                            <p
                                className="post-username cursor-pointer fw-bold"
                                onClick={() => handleGoProfile(post.username)}
                            >
                                {post.username}
                            </p>
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
                                    <div
                                        className="dropdown-item text-red-500"
                                        onClick={handleDelete}
                                    >
                                        delete
                                    </div>
                                    <div
                                        className="dropdown-item"
                                        onClick={handleShowEditModal}
                                    >
                                        edit
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="post-comments flow">
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
                                    <div
                                        className="post-avatar cursor-pointer"
                                        onClick={() =>
                                            handleGoProfile(post.username)
                                        }
                                    >
                                        <img
                                            src={post.userPhotoURL}
                                            alt={post.username}
                                            className="img-fluid"
                                        />
                                    </div>
                                    <p className="post-username cursor-pointer fw-bold">
                                        {post.username}
                                    </p>
                                </div>
                                <div>
                                    <div>{post.caption}</div>
                                    <small>{post.createdAt}</small>
                                </div>
                            </div>
                        )}
                        {post.comments.length > 0 && (
                            <>
                                {post.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="d-flex items-center"
                                        style={{ '--gap': '0.25rem' }}
                                    >
                                        <div className="post-author d-flex items-center">
                                            <div
                                                className="post-avatar cursor-pointer"
                                                onClick={() =>
                                                    handleGoProfile(
                                                        comment.username
                                                    )
                                                }
                                            >
                                                <img
                                                    src={comment.userPhotoURL}
                                                    alt={comment.username}
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p
                                                className="post-username cursor-pointer fw-bold"
                                                onClick={() =>
                                                    handleGoProfile(
                                                        comment.username
                                                    )
                                                }
                                            >
                                                {comment.username}
                                            </p>
                                        </div>
                                        <div>
                                            <p>{comment.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <div className="post-action">
                        <div className="post-action-icon d-flex justify-between items-center">
                            <div className="d-flex">
                                <div
                                    className="post-icon"
                                    onClick={handleLikePost}
                                >
                                    <Like
                                        theme={post.isLiked ? 'filled' : ''}
                                    />
                                </div>
                                <div
                                    className="post-icon"
                                    onClick={() => {
                                        commentRef.current.focus();
                                    }}
                                >
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
                            <p
                                className="fw-bolds cursor-pointer"
                                onClick={handleShowLikeList}
                            >
                                {post.likeCount} likes
                            </p>
                            <small>{post.createdAt}</small>
                        </div>
                    </div>
                    <div className="post-controls d-flex items-center">
                        <input
                            type="text"
                            id="comment"
                            name="comment"
                            ref={commentRef}
                            onChange={handleChange}
                            placeholder="Add a comment..."
                        />
                        <div
                            id="comment-post"
                            data-visible="false"
                            className="text-blue-400 fw-bold"
                            onClick={handleCommentPost}
                        >
                            post
                        </div>
                    </div>
                </div>
            </article>
            {isOpen && (
                <LikeModal
                    postId={post._id}
                    setIsOpen={setIsOpen}
                    handleGoProfile={handleGoProfile}
                />
            )}
            {isOpenEdit && (
                <Modal size="xs">
                    <div className="write d-flex">
                        <div className="write-media">
                            <Slide media={post.media} />
                        </div>
                        <div className="write-content flow">
                            <div className="d-flex write-info">
                                <div className="write-img">
                                    <img
                                        className="img-fluid"
                                        src={
                                            currentUser.photoURL
                                                ? currentUser.photoURL
                                                : defaultAvatar
                                        }
                                        alt={currentUser.username}
                                    />
                                </div>
                                <div className="write-username fw-bold">
                                    {currentUser.username}
                                </div>
                            </div>
                            <textarea
                                name="caption"
                                id="caption"
                                ref={captionRef}
                                onChange={handleCaptionChange}
                                className="write-control"
                                defaultValue={post.caption}
                                placeholder="Write a caption..."
                            ></textarea>
                            <div className="write-action d-flex items-center">
                                <button
                                    button-variant="contained"
                                    button-color="blue"
                                    id="editBtn"
                                    onClick={handleEdit}
                                    data-visible={false}
                                >
                                    done
                                </button>
                                <button
                                    onClick={() => setIsOpenEdit(false)}
                                    button-variant="contained"
                                    button-color="red"
                                >
                                    discard
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default PostModal;
