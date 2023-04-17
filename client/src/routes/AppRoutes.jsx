// Import components
import { Routes, Route } from 'react-router-dom';

// Import components
import {
    Home,
    LogIn,
    SignUp,
    Profile,
    Setting,
    EditProfile,
    ChangePassword,
    PrivacyAndSecurity,
    FollowerReq,
} from '../pages';
import AuthRoutes from './AuthRoutes';
import PrivateRoutes from './PrivateRoutes';
import { Wrapper } from '../components';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AuthRoutes />}>
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
            </Route>
            <Route element={<PrivateRoutes />}>
                <Route element={<Wrapper />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/:username/" element={<Profile />} />
                    <Route path="/follower-request" element={<FollowerReq />} />

                    <Route element={<Setting />}>
                        <Route
                            path="/accounts/edit"
                            element={<EditProfile />}
                        />
                        <Route
                            path="/accounts/change_password"
                            element={<ChangePassword />}
                        />
                        <Route
                            path="/accounts/privacy_and_security"
                            element={<PrivacyAndSecurity />}
                        />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
