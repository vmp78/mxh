import { Container } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Header from './components/Header';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import LogoutButton from './components/LogoutButton';

function App() {
    const user = useRecoilValue(userAtom);
    console.log(user);
    return (
        <Container maxW="full" p={0}>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <Container maxW="620px">
                                <Header />
                                <HomePage />
                            </Container>
                        ) : (
                            <Navigate to="/auth" />
                        )
                    }
                />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                    path="/:username"
                    element={
                        <Container maxW="620px">
                            <Header />
                            <UserPage />
                        </Container>
                    }
                />
                <Route
                    path="/:username/post/:pid"
                    element={
                        <Container maxW="620px">
                            <Header />
                            <PostPage />
                        </Container>
                    }
                />
            </Routes>

            {user && LogoutButton}
        </Container>
    );
}

export default App;
