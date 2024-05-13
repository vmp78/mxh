import { Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

const LogoutButton = () => {
    // connect to be
    const handleLogout = async () => {};
    return (
        <Button position="fixed" top="30px" right="30px" size="sm" onClick={handleLogout}>
            Log out
        </Button>
    );
};

export default LogoutButton;
