import { Button, Flex, } from "@chakra-ui/react";
import { Link } from "react-router-dom";


const HomePage = () => {

    return (
        <Flex direction="column" w="full" align="center" gap={4}>
            <Link to={'/top1pdp2k3'} >
                <Button mx='auto'>Visit Profile Page</Button>
            </Link>
        </Flex>
    );
};

export default HomePage;