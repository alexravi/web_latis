import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../features/dashboard/Dashboard';
import CompleteProfile from '../features/profile/CompleteProfile';
import ProfileView from '../features/profile/ProfileView';
import NodesPage from '../features/network/NodesPage';
import SecureConsultsPage from '../features/messaging/SecureConsultsPage';
import { PublicRoute, ProtectedRoute } from './RouteGuards';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/nodes" element={<ProtectedRoute><NodesPage /></ProtectedRoute>} />
            <Route path="/messaging" element={<ProtectedRoute><SecureConsultsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
            <Route path="/users/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
            <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
            {/* Generic catch-all for user profiles at root level - MUST BE LAST */}
            <Route path="/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;
