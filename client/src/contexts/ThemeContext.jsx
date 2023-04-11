// Import library
import React, { useContext, useEffect, useState } from 'react';

// Import components

// Create context
const ThemeContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

// Create provider
export const ThemeProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState();
    const [isOpen, setIsOpen] = useState(false);

    // Method
    function getTheme() {
        const appTheme = localStorage.getItem('theme');
        if (!appTheme) {
            localStorage.setItem('theme', 'light');
            setTheme('light');
        } else {
            setTheme(appTheme);
        }

        setLoading(false);
    }

    function changeTheme() {
        if (theme === 'light') {
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        } else {
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }
    }

    function sidebarOption(e) {
        const _classList = e.target.parentNode.classList;

        if (
            Object.values(_classList).includes('sidebar-more') ||
            Object.values(_classList).includes('sidebar-more-button') ||
            Object.values(_classList).includes('i-icon-hamburger-button') ||
            Object.values(_classList).includes('sidebar-more-theme')
        ) {
            return;
        } else {
            return setIsOpen(false);
        }
    }

    // Side Effect
    useEffect(() => {
        getTheme();
        window.addEventListener('click', (e) => sidebarOption(e));

        return () => {
            window.removeEventListener('click', (e) => sidebarOption(e));
        };
    }, []);

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
    }, [theme]);

    // Props
    const value = {
        theme,
        changeTheme,
        isOpen,
        setIsOpen,
    };

    return (
        <ThemeContext.Provider value={value}>
            {!loading && children}
        </ThemeContext.Provider>
    );
};
