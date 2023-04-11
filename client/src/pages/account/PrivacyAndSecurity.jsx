// Import library
import React, { useEffect, useState, useRef } from 'react';
import { VideoTwo, AtSign, UpdateRotation } from '@icon-park/react';

// Import components
import { useAuth } from '../../contexts';
import { Modal } from '../../components';

const PrivacyAndSecurity = () => {
    const { currentUser, updateUser } = useAuth();

    const inputRef = useRef();

    const [isOpenModal, setIsOpenModal] = useState(false);

    /**
     * Handle event
     */
    async function handleSecureAccount() {
        const isPrivateAccount = !currentUser.private;

        const formData = {
            id: currentUser.id,
            private: isPrivateAccount,
        };

        await updateUser(formData);

        setIsOpenModal(false);
    }

    /**
     * Side effect
     */
    useEffect(() => {
        inputRef.current.checked = currentUser.private;
    }, [currentUser]);

    return (
        <>
            <div className="flow">
                <h4>Account privacy</h4>
                <div>
                    <input
                        type="checkbox"
                        name="private"
                        id="private"
                        ref={inputRef}
                        style={{ marginRight: '0.5rem' }}
                    />
                    <label onClick={() => setIsOpenModal(true)}>
                        Private account
                    </label>
                </div>
                <p className="text-small">
                    When your account is public, your profile and posts can be
                    seen by anyone, on or off Instagram, even if they don’t have
                    an Instagram account. When your account is private, only the
                    followers you approve can see what you share, including your
                    photos or videos on hashtag and location pages, and your
                    followers and following lists.
                </p>
            </div>
            {isOpenModal && !currentUser.private && (
                <Modal title="switch to private account?">
                    <div className="modal-content flow">
                        <div className="d-flex items-center">
                            <div className="modal-icon">
                                <VideoTwo />
                            </div>
                            <p className="text-small">
                                Only your followers will be able to see your
                                photos and videos.
                            </p>
                        </div>
                        <div className="d-flex items-center">
                            <div className="modal-icon">
                                <UpdateRotation />
                            </div>
                            <p className="text-small">
                                This won't change who can message, tag or
                                @mention you but you won't be able to tag people
                                who don't follow you.
                            </p>
                        </div>
                    </div>
                    <p
                        onClick={handleSecureAccount}
                        className="fw-bold text-blue-400"
                    >
                        switch to private
                    </p>
                    <p
                        className="fw-bold"
                        onClick={() => setIsOpenModal(false)}
                    >
                        cancel
                    </p>
                </Modal>
            )}
            {isOpenModal && currentUser.private && (
                <Modal title="Switch to public account?">
                    <div className="modal-content flow">
                        <div className="d-flex items-center">
                            <div className="modal-icon">
                                <VideoTwo />
                            </div>
                            <p className="text-small">
                                Anyone can see your posts, reels, and stories,
                                and can use your original audio.
                            </p>
                        </div>
                        <div className="d-flex items-center">
                            <div className="modal-icon">
                                <AtSign />
                            </div>
                            <p className="text-small">
                                This won't change who can message, tag or
                                @mention you.
                            </p>
                        </div>
                        <div className="d-flex items-center">
                            <div className="modal-icon">
                                <AtSign />
                            </div>
                            <p className="text-small">
                                People can remix your reels and download them as
                                part of a remix. You can change this in
                                settings.
                            </p>
                        </div>
                    </div>
                    <p
                        onClick={handleSecureAccount}
                        className="fw-bold text-blue-400"
                    >
                        switch to public
                    </p>
                    <p
                        className="fw-bold"
                        onClick={() => setIsOpenModal(false)}
                    >
                        cancel
                    </p>
                </Modal>
            )}
        </>
    );
};

export default PrivacyAndSecurity;
