// Import library
import { Outlet } from 'react-router-dom';

// Import components
import Sidebar from './Sidebar';

const Wrapper = () => {
    return (
        <main className="main d-flex">
            <Sidebar />
            <Outlet />
        </main>
    );
};

export default Wrapper;
