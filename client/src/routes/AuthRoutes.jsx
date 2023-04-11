// Import library
import { Outlet, Navigate } from 'react-router-dom';

// Import components
import { useAuth } from '../contexts';

const AuthRoutes = () => {
    const { currentUser } = useAuth();

    return !currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default AuthRoutes;
