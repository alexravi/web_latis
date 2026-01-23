import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicRoute, ProtectedRoute } from './RouteGuards';
import LoadingFallback from '../components/LoadingFallback';

// Lazy load components for code splitting
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const CompleteProfile = lazy(() => import('../features/profile/CompleteProfile'));
const ProfileView = lazy(() => import('../features/profile/ProfileView'));
const NodesPage = lazy(() => import('../features/network/NodesPage'));
const SearchResultsPage = lazy(() => import('../pages/SearchResultsPage'));
const SecureConsultsPage = lazy(() => import('../features/messaging/SecureConsultsPage'));
const MessagingPage = lazy(() => import('../pages/MessagingPage'));
const PostPage = lazy(() => import('../pages/PostPage'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Suspense fallback={<LoadingFallback message="Loading login..." />}>
                                <Login />
                            </Suspense>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Suspense fallback={<LoadingFallback message="Loading signup..." />}>
                                <Signup />
                            </Suspense>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading dashboard..." />}>
                                <Dashboard />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/posts/:id"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading discussion..." />}>
                                <PostPage />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/nodes"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading network..." />}>
                                <NodesPage />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/messaging"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading messages..." />}>
                                <SecureConsultsPage />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading chat..." />}>
                                <MessagingPage />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/complete-profile"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading profile editor..." />}>
                                <CompleteProfile />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading search..." />}>
                                <SearchResultsPage />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                {/* Generic catch-all for user profiles at root level - MUST BE LAST */}
                <Route
                    path="/:id"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<LoadingFallback message="Loading profile..." />}>
                                <ProfileView />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
