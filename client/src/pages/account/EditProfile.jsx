// Import library
import React, { useEffect, useState, useRef } from 'react';

// Import components
import { useAuth } from '../../contexts';
import defaultAvatar from '../../assets/default_avatar.jpg';
import { Modal } from '../../components';
import { gender } from '../../constants';
import { convertImageToBase64 } from '../../utils';

const EditProfile = () => {
    const { currentUser, updateUser } = useAuth();

    const avatarRef = useRef();
    const fullnameRef = useRef();
    const usernameRef = useRef();
    const bioRef = useRef();
    const emailRef = useRef();
    const genderRef = useRef();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    /**
     * Handle event
     */
    function handleClickAvatar() {
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

    function handleControlChange() {
        const dataControl = {
            fullname: fullnameRef.current.value,
            username: usernameRef.current.value,
            bio: bioRef.current.value,
            email: emailRef.current.value,
            gender: parseInt(genderRef.current.value),
        };

        const dataUser = {
            fullname: user.fullname,
            username: user.username,
            bio: user.bio,
            email: user.email,
            gender: user.gender,
        };

        if (JSON.stringify(dataControl) === JSON.stringify(dataUser)) {
            return setIsChanged(false);
        } else {
            return setIsChanged(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO Validation
        if (
            !fullnameRef.current.value ||
            !usernameRef.current.value ||
            !emailRef.current.value
        ) {
            // ? Notification: you have not entered the data
            console.log('Bạn chưa nhập đủ dữ liệu');
            return;
        }

        // TODO Define formData
        const formData = {
            id: user.id,
        };

        if (fullnameRef.current.value !== user.fullname) {
            formData.fullname = fullnameRef.current.value;
        }

        if (usernameRef.current.value !== user.username) {
            formData.username = usernameRef.current.value;
        }

        if (emailRef.current.value !== user.email) {
            formData.email = emailRef.current.value;
        }

        if (bioRef.current.value !== user.bio) {
            formData.bio = bioRef.current.value;
        }

        if (parseInt(genderRef.current.value) !== user.gender) {
            formData.gender = parseInt(genderRef.current.value);
        }

        await updateUser(formData);
    };

    /**
     * Side effect
     */
    useEffect(() => {
        if (!user) {
            setUser(currentUser);
        }

        if (user && JSON.stringify(user) !== JSON.stringify(currentUser)) {
            setUser(currentUser);
            setIsChanged(false);
        }

        setLoading(false);

        return () => {
            setLoading(true);
        };
    }, [currentUser]);

    useEffect(() => {
        if (!loading) {
            fullnameRef.current.value = user.fullname;
            usernameRef.current.value = user.username;
            bioRef.current.value = user.bio;
            emailRef.current.value = user.email;
            genderRef.current.value = user.gender;
        }
    }, [loading]);

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <>
            <div className="setting-header">
                <div className="setting-avatar d-flex items-center">
                    <div className="setting-avatar-img">
                        <img
                            onClick={handleClickAvatar}
                            src={user.photoURL ? user.photoURL : defaultAvatar}
                            alt={user.username}
                        />
                    </div>
                    <div className="setting-avatar-info">
                        <p className="setting-avatar-username">
                            {user.username}
                        </p>
                        <p
                            onClick={handleClickAvatar}
                            className="setting-avatar-action text-blue-500 fw-semibold"
                        >
                            change profile photo
                        </p>
                    </div>
                    <input
                        type="file"
                        id="file"
                        ref={avatarRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
            <form className="setting-form flow" onSubmit={handleSubmit}>
                <div className="setting-form-group">
                    <label htmlFor="fullname" className="setting-form-label">
                        fullname
                    </label>
                    <input
                        className="setting-form-control"
                        id="fullname"
                        name="fullname"
                        type="text"
                        onChange={handleControlChange}
                        ref={fullnameRef}
                    />
                </div>
                <div className="setting-form-group">
                    <label htmlFor="username" className="setting-form-label">
                        username
                    </label>
                    <input
                        className="setting-form-control"
                        id="username"
                        name="username"
                        type="text"
                        onChange={handleControlChange}
                        ref={usernameRef}
                    />
                </div>
                <div className="setting-form-group">
                    <label htmlFor="email" className="setting-form-label">
                        email
                    </label>
                    <input
                        className="setting-form-control"
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleControlChange}
                        ref={emailRef}
                    />
                </div>
                <div className="setting-form-group">
                    <label htmlFor="bio" className="setting-form-label">
                        bio
                    </label>
                    <textarea
                        className="setting-form-control"
                        id="bio"
                        name="bio"
                        type="text"
                        onChange={handleControlChange}
                        ref={bioRef}
                    ></textarea>
                </div>
                <div className="setting-form-group">
                    <label htmlFor="gender" className="setting-form-label">
                        gender
                    </label>
                    <select
                        className="setting-form-control"
                        name="gender"
                        id="gender"
                        onChange={handleControlChange}
                        ref={genderRef}
                    >
                        {gender.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="setting-form-btn">
                    <div></div>
                    <button
                        className="button"
                        button-variant="contained"
                        button-color="blue"
                        data-visible={isChanged}
                    >
                        submit
                    </button>
                </div>
            </form>
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
        </>
    );
};

export default EditProfile;
