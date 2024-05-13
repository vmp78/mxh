import { Button } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';

const LogoutButton = () => {
    // connect to be
    const handleLogout = async () => {};
    return (
        <Button position="fixed" top="30px" right="30px" size="sm" onClick={handleLogout}>
            <MdLogout />
        </Button>
    );
};

export default LogoutButton;
