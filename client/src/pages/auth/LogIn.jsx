// Import library
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import components
import { useAuth } from '../../contexts/AuthContext';

const LogIn = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();

    const { login } = useAuth();

    /**
     * Handle event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO Validation
        if (!usernameRef.current.value && !passwordRef.current.value) {
            // ? Notification: you have not entered the data
            console.log('Bạn chưa nhập đủ dữ liệu');
            return;
        }

        // TODO Define formData
        const formData = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };

        const ok = await login(formData);

        if (ok) {
            // TODO Navigate to home page
            navigate('/signup');
        }
    };

    return (
        <section className="auth d-flex justify-center items-center flex-column">
            <form className="form auth-form" onSubmit={handleSubmit}>
                <div className="auth-logo">
                    <h3>Instagram</h3>
                </div>
                <div className="auth-group flow">
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            ref={usernameRef}
                            placeholder=" "
                            id="username"
                            name="username"
                        />
                        <label htmlFor="username" className="form-label">
                            tên người dùng hoặc email
                        </label>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            ref={passwordRef}
                            placeholder=" "
                            id="password"
                            name="password"
                        />
                        <label htmlFor="password" className="form-label">
                            mật khẩu
                        </label>
                    </div>
                </div>

                <button
                    className="button auth-button"
                    type="submit"
                    button-variant="contained"
                    button-color="blue"
                >
                    đăng nhập
                </button>
            </form>

            <div className="auth-footer">
                <p>
                    Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
                </p>
            </div>
        </section>
    );
};

export default LogIn;
