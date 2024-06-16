import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Comment = ({ reply, lastReply }) => {
    return (
        <>
            <Flex gap={4} py={2} my={2} w={'full'} as={Link} to={`/${reply.username}`}>
                <Avatar src={reply.userAvatar} size={'sm'} />
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize="sm" fontWeight="bold">
                            {reply.username}
                        </Text>
                    </Flex>
                    <Text>{reply.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider variant={'solid'} /> : null}
        </>
    );
};

export default Comment;
