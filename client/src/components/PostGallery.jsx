// Import library
import React, { useState } from 'react';
import { CameraThree, Like, Comments, Close } from '@icon-park/react';
import Modal from './Modal';
import PostModal from './PostModal';

// Import components

const PostGallery = ({ posts }) => {
    const [modalData, setModalData] = useState({
        isOpen: false,
        postId: '',
    });

    /**
     * Handle event
     */
    function handleOpenPostModal(postId) {
        setModalData((prev) => {
            return {
                ...prev,
                isOpen: true,
                postId,
            };
        });
    }

    function handleClosePostModal() {
        setModalData((prev) => {
            return {
                ...prev,
                isOpen: false,
                postId: '',
            };
        });
    }

    if (!posts.length) {
        return (
            <div className="profile-post flow" data-post-length="false">
                <div className="profile-post-icon">
                    <CameraThree />
                </div>
                <div className="fs-500 fw-bold">Share Photos</div>
                <p>When you share photos, they will appear on your profile.</p>
            </div>
        );
    }

    return (
        <>
            <div className="profile-post" data-post-length="true">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        onClick={() => handleOpenPostModal(post._id)}
                        className="profile-post-item"
                    >
                        <img
                            src={post.media[0]}
                            alt="Post image"
                            className="img-fluid"
                        />
                        <div className="profile-post-info d-flex justify-center items-center">
                            <div className="d-flex items-center">
                                <div className="profile-post-action">
                                    <Like theme="filled" />
                                    {post.likeCount}
                                </div>
                                <div className="profile-post-action">
                                    <Comments theme="filled" />
                                    {post.commentCount}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {modalData.isOpen && (
                <Modal size="xxs">
                    <div className="modal-close" onClick={handleClosePostModal}>
                        <Close />
                    </div>
                    <PostModal
                        id={modalData.postId}
                        setModalData={setModalData}
                    />
                </Modal>
            )}
        </>
    );
};

export default PostGallery;
