// Import library
import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Import components
import { useAuth } from '../../contexts/AuthContext';

const SignUp = () => {
    const emailRef = useRef();
    const fullNameRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();

    const { signup } = useAuth();

    /**
     * Handle event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO Validation
        if (
            !emailRef.current.value ||
            !fullNameRef.current.value ||
            !usernameRef.current.value ||
            !passwordRef.current.value
        ) {
            // ? Notification: you have not entered the data
            console.log('Bạn chưa nhập đủ dữ liệu');
            return;
        }

        // TODO Define formData
        const formData = {
            email: emailRef.current.value,
            fullname: fullNameRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };

        const ok = await signup(formData);

        if (ok) {
            // TODO Navigate to signin
            navigate('/login');
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
                            ref={emailRef}
                            placeholder=" "
                            id="email"
                            name="email"
                        />
                        <label htmlFor="email" className="form-label">
                            email
                        </label>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            ref={fullNameRef}
                            placeholder=" "
                            id="fullname"
                            name="fullname"
                        />
                        <label htmlFor="fullname" className="form-label">
                            họ và tên
                        </label>
                    </div>
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
                            tên người dùng
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
                    đăng ký
                </button>
            </form>
            <div className="auth-footer">
                <p>
                    Bạn có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </section>
    );
};

export default SignUp;
