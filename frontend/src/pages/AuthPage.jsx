import { Image, Box, Center, Flex } from '@chakra-ui/react';
import SignupCard from '../components/SignUpCard';
import LoginCard from '../components/LoginCard';
import { useRecoilValue } from 'recoil';
import authScreenAtom from '../atoms/authAtom';

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom); // to change between sign up and login
    return (
        <Box position="relative" pt="20vh">
            {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}

            <Image
                src="https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp"
                objectFit="cover"
                w="full"
                h="full"
                zIndex={-1}
                position="absolute"
                top={0}
                left={0}
            />

            <Center>
                <Flex gap={3} color="gray" fontSize="small">
                    <Box h="10">© 2024</Box>
                    <Box h="10">Threads Terms</Box>
                    <Box h="10">Privacy Policy</Box>
                    <Box h="10">Cookies Policy</Box>
                    <Box h="10">Report a problem</Box>
                </Flex>
            </Center>
        </Box>
    );
};

export default AuthPage;
