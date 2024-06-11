import { Flex, Image } from '@chakra-ui/react';
import EmailCard from '../components/EmailCard';

const ForgotPasswordPage = () => {
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
            <EmailCard />
        </Flex>
    );
};

export default ForgotPasswordPage;
