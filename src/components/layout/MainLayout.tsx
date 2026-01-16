import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    return (
        <div className="layout-container">
            <header className="layout-header">
                <div className="logo">Latis</div>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </nav>
            </header>
            <main className="layout-content">
                <Outlet />
            </main>
            <footer className="layout-footer">
                <p>&copy; 2024 Latis Application</p>
            </footer>
        </div>
    );
};

export default MainLayout;
