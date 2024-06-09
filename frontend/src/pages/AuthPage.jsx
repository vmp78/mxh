import SignupCard from '../components/SignUpCard';
import LoginCard from '../components/LoginCard';
import { useRecoilValue } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import { Flex, Image } from '@chakra-ui/react';
import OTPCard from '../components/OTPCard';
import ResetPasswordCard from '../components/ResetPasswordCard';
import { createContext, useState } from 'react';

export const RecoveryContext = createContext();
const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom); // to change between sign up and login
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    function NavigateComponent() {
        if (authScreenState === 'login') return <LoginCard />;
        if (authScreenState === 'signup') return <SignupCard />;
        if (authScreenState === 'otp') return <OTPCard />;
        if (authScreenState === 'reset') return <ResetPasswordCard />;
        return null;
    }
    return (
        <RecoveryContext.Provider value={{ authScreenState, authScreenAtom, otp, setOtp, setEmail, email }}>
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
