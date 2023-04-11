// Import library
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// Import components

const Setting = () => {
    return (
        <section className="section">
            <div className="section-container">
                <div className="setting d-flex">
                    <div className="setting-option">
                        <NavLink
                            to="/accounts/edit/"
                            end
                            className="setting-option-item"
                        >
                            edit profile
                        </NavLink>
                        <NavLink
                            to="/accounts/change_password"
                            className="setting-option-item"
                        >
                            change password
                        </NavLink>
                        <NavLink
                            to="/accounts/privacy_and_security"
                            className="setting-option-item"
                        >
                            privacy and security
                        </NavLink>
                    </div>
                    <div className="setting-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Setting;
