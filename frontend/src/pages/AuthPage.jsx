import { Flex, Image } from '@chakra-ui/react';
import { createContext } from 'react';
import { useRecoilValue } from 'recoil';
import { authScreenAtom } from '../atoms/authAtom';
import LoginCard from '../components/LoginCard';
import SignupCard from '../components/SignUpCard';

export const RecoveryContext = createContext();
const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom); // to change between sign up and login

    function NavigateComponent() {
        if (authScreenState === 'login') return <LoginCard />;
        if (authScreenState === 'signup') return <SignupCard />;
        return null;
    }
    return (
        <RecoveryContext.Provider value={{ authScreenState, authScreenAtom }}>
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
                <NavigateComponent />
            </Flex>
        </RecoveryContext.Provider>
    );
};

export default AuthPage;
