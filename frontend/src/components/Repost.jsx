import { Flex, Box, Avatar, Text, Image, VStack, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { postsAtom } from '../atoms/postsAtom';
import { formatDistanceToNow } from 'date-fns';
import useShowToast from '../hooks/useShowToast';
import Actions from './Actions';
import { Link } from 'react-router-dom';
import userAtom from '../atoms/userAtom';
import { RepeatIcon } from '@chakra-ui/icons';

const Repost = ({ post, postedBy }) => {
    const [postUser, setPostUser] = useState(null);
    const [repostUser, setRepostUser] = useState(null);
    const navigate = useNavigate();
    const showToast = useShowToast();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!postedBy || !post) return;
        const getUser = async () => {
            try {
                const [postUserResponse, repostUseresponse] = await Promise.all([
                    fetch(`api/users/profile/${post.postedBy}`),
                    fetch(`api/users/profile/${postedBy}`),
                ]);

                if (!postUserResponse.ok || !repostUseresponse.ok) {
                    throw new Error('Failed to fetch posts and reposts');
                }

                const postUserData = await postUserResponse.json();
                const repostUserData = await repostUseresponse.json();

                setPostUser(postUserData);
                setRepostUser(repostUserData);
            } catch (error) {
                showToast('Error at Repost', error.message, 'error');
                setPostUser(null);
                setRepostUser(null);
            }
        };

        getUser();
    }, [showToast, postedBy]);

    if (!postUser || !repostUser) return null;
    return (
        <>
            <Box
                mb={5}
                color="gray.400"
                cursor={'pointer'}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${repostUser.username}`);
                }}
            >
                <RepeatIcon />
                <Box fontSize="small" fontWeight="bold" alignSelf="start" display="inline-block" ml={1}>
                    {repostUser.username}
                    <Text display="inline-block" ml={1} fontWeight="normal">
                        {' '}
                        reposted
                    </Text>
                </Box>
            </Box>
            <Flex gap={3} mb={10}>
                <Avatar
                    mt={1}
                    size="md"
                    name={postUser.name}
                    src={postUser?.avatar}
                    _hover={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/${postUser.username}`);
                    }}
                />
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text
                                _hover={{ cursor: 'pointer' }}
                                fontSize={'sm'}
                                fontWeight={'bold'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${postUser.username}`);
                                }}
                            >
                                {postUser?.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                        </Flex>
                    </Flex>
                    <Link to={`/${postUser.username}/post/${post._id}`}>
                        <Text fontSize={'sm'} mb={2}>
                            {post.text}
                        </Text>
                        {post.img && (
                            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                                <Image src={post.img} w={'full'} />
                            </Box>
                        )}
                    </Link>
                </Flex>
            </Flex>
        </>
    );
};

export default Repost;
