import { Box, Container } from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import CreatePost from './components/CreatePost';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import EditProfilePage from './pages/EditProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserPage from './pages/UserPage';
function App() {
    const user = useRecoilValue(userAtom);
    const { pathname } = useLocation();
    return (
        <Box position={'relative'} w="full">
            {pathname !== '/auth' && pathname !== '/auth/forgot-password' && <Header />}
            <Container maxW={pathname === '/' || pathname === '/auth' ? { base: '620px', md: '900px' } : '620px'}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            user ? (
                                <>
                                    <HomePage />
                                    <CreatePost />
                                </>
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
                    <Route
                        path="/auth/forgot-password"
                        element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/auth/reset-password/:userid/:token"
                        element={!user ? <ResetPasswordPage /> : <Navigate to="/" />}
                    />
                    <Route path="/update" element={user ? <EditProfilePage /> : <Navigate to="/auth" />} />

                    <Route
                        path="/:username"
                        element={
                            user.username === pathname.slice(1) ? (
                                <>
                                    <UserPage />
                                    <CreatePost />
                                </>
                            ) : (
                                <UserPage />
                            )
                        }
                    />
                    <Route path="/:username/post/:pid" element={<PostPage />} />
                    <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={'/auth'} />} />
                </Routes>
            </Container>
        </Box>
    );
}

export default App;
