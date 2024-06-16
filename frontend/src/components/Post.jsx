import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import Actions from './Actions';
import { EditIcon } from '@chakra-ui/icons';

const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!postedBy) return;
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${postedBy}`);
                const data = await res.json();
                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
                setUser(null);
            }
        };

        getUser();
    }, [postedBy, showToast]);

    if (!user) return null;
    return (
        <>
            {post.createdAt !== post.updatedAt && (
                <Box color="gray.400">
                    <EditIcon />
                    <Box fontSize="small" alignSelf="start" display="inline-block" ml={1}>
                        edited {formatDistanceToNow(new Date(post.updatedAt))} ago
                    </Box>
                </Box>
            )}
            <Flex gap={3} mb={4} py={5}>
                <Flex _hover={{ cursor: 'pointer' }} flexDirection={'column'} alignItems={'center'}>
                    <Avatar
                        size="md"
                        name={user.name}
                        src={user?.avatar}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);
                        }}
                    />
                    <Box w="1px" h={'full'} bg="gray.light" my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        {post.replies.length === 0 && <Text textAlign={'center'}>🥱</Text>}
                        {post.replies[0] && (
                            <Avatar
                                size="xs"
                                name="John doe"
                                src={post.replies[0].userAvatar}
                                position={'absolute'}
                                top={'0px'}
                                left="15px"
                                padding={'2px'}
                            />
                        )}

                        {post.replies[1] && (
                            <Avatar
                                size="xs"
                                name="John doe"
                                src={post.replies[1].userAvatar}
                                position={'absolute'}
                                bottom={'0px'}
                                right="-5px"
                                padding={'2px'}
                            />
                        )}

                        {post.replies[2] && (
                            <Avatar
                                size="xs"
                                name="John doe"
                                src={post.replies[2].userAvatar}
                                position={'absolute'}
                                bottom={'0px'}
                                left="4px"
                                padding={'2px'}
                            />
                        )}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={1}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text
                                _hover={{ cursor: 'pointer' }}
                                fontSize={'sm'}
                                fontWeight={'bold'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >
                                {user?.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                        </Flex>
                    </Flex>

                    <Link to={`/${user.username}/post/${post._id}`}>
                        <Text fontSize={'sm'} mb={2}>
                            {post.text}
                        </Text>
                        {post.img && (
                            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                                <Image src={post.img} w={'full'} />
                            </Box>
                        )}
                    </Link>
                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
};

export default Post;
