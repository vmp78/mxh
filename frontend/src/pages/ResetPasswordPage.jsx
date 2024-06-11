import { Flex, Image } from '@chakra-ui/react';
import ResetPasswordCard from '../components/ResetPasswordCard';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ResetPasswordPage = () => {
    const [verified, setVerified] = useState(false);
    const { userid, token } = useParams();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await fetch(`/api/users/reset-password/${userid}/${token}`);
                const data = await res.json();
                if (data.error) {
                    setVerified(false);
                    return;
                }
                setVerified(true);
            } catch (error) {
                console.log(error);
            }
        };

        verifyToken();
    }, [userid, token]);

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
            {verified ? <ResetPasswordCard /> : null}
        </Flex>
    );
};

export default ResetPasswordPage;
