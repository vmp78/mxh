import SignupCard from '../components/SignUpCard';
import LoginCard from '../components/LoginCard';
import { useRecoilValue } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import { Flex, Image } from '@chakra-ui/react';

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom); // to change between sign up and login
    return (
        <Flex direction={'column'}>
            <Image
                src="https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp"
                alt="Just for decorating"
                position={'absolute'}
                fit={'fill'}
                top={0}
                left={0}
                zIndex={-1}
            />
            {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}
        </Flex>
    );
};

export default AuthPage;
