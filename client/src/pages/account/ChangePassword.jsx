// Import library
import { useRef, useState } from 'react';

// Import components
import { useAuth } from '../../contexts';

const ChangePassword = () => {
    const { currentUser } = useAuth();

    const passwordRef = useRef();
    const newPasswordRef = useRef();
    const reNewPasswordRef = useRef();

    const [isSubmit, setIsSubmit] = useState(false);

    /**
     * Handle event
     */
    const handleControlChange = () => {
        if (
            !passwordRef.current.value ||
            !newPasswordRef.current.value ||
            !reNewPasswordRef.current.value
        ) {
            return setIsSubmit(false);
        }

        return setIsSubmit(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO Validation
        if (newPasswordRef.current.value !== reNewPasswordRef.current.value) {
            // ? Notification: you have not entered the data
            console.log('Mật khẩu mới không trùng nhau!');
            return;
        }

        // TODO Define formData
        const formData = {
            id: user.id,
        };
    };

    return (
        <>
            <div className="setting-header">
                <div className="setting-avatar d-flex items-center">
                    <div className="setting-avatar-img">
                        <img
                            src={
                                currentUser.photoURL
                                    ? currentUser.photoURL
                                    : defaultAvatar
                            }
                            alt={currentUser.username}
                        />
                    </div>
                    <div className="setting-avatar-info">
                        <p className="setting-avatar-username">
                            {currentUser.username}
                        </p>
                    </div>
                </div>
            </div>
            <form className="setting-form flow" onSubmit={handleSubmit}>
                <div className="setting-form-group">
                    <label htmlFor="password" className="setting-form-label">
                        old password
                    </label>
                    <input
                        className="setting-form-control"
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleControlChange}
                        ref={passwordRef}
                    />
                </div>
                <div className="setting-form-group">
                    <label htmlFor="newPassword" className="setting-form-label">
                        new password
                    </label>
                    <input
                        className="setting-form-control"
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        onChange={handleControlChange}
                        ref={newPasswordRef}
                    />
                </div>
                <div className="setting-form-group">
                    <label
                        htmlFor="reNewPassword"
                        className="setting-form-label"
                    >
                        Confirm new password
                    </label>
                    <input
                        className="setting-form-control"
                        id="reNewPassword"
                        name="reNewPassword"
                        type="password"
                        onChange={handleControlChange}
                        ref={reNewPasswordRef}
                    />
                </div>
                <div className="setting-form-btn">
                    <div></div>
                    <button
                        className="button"
                        button-variant="contained"
                        button-color="blue"
                        data-visible={isSubmit}
                    >
                        change password
                    </button>
                </div>
            </form>
        </>
    );
};

export default ChangePassword;
