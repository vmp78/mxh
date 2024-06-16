import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsAtom } from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import DeletePost from '../components/DeletePost';
import UpdatePost from '../components/UpdatePost';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';

const PostPage = () => {
    const { pid } = useParams();
    const { user, loading } = useGetUserProfile();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();

    const [isUpdatePostOpen, setIsUpdatePostOpen] = useState(false);
    const handleUpdatePostOpen = () => {
        setIsUpdatePostOpen(true);
    };
    const handleUpdatePostClose = () => {
        setIsUpdatePostOpen(false);
    };

    const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
    const handleDeletePostOpen = () => {
        setIsDeletePostOpen(true);
    };
    const handleDeletePostClose = () => {
        setIsDeletePostOpen(false);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const getPost = async () => {
            setPosts([]);
            try {
                const res = await fetch(`/api/posts/${pid}`);
                const data = await res.json();
                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                }
                setPosts(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
            }
        };
        getPost();
    }, [showToast, pid, setPosts]);

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'xl'} />
            </Flex>
        );
    }

    if (!user || !posts) {
        return (
            <Flex fontWeight={'600'} fontSize={'30'} textColor={' rgb(100 116 139)'}>
                User not found!!!
            </Flex>
        );
    }

    if (!posts[0]) return null;

    return (
        <>
            <Flex>
                <Flex as={Link} to={`/${user.username}`} w={'full'} alignItems={'center'} gap={3}>
                    <Flex gap={2} justifyContent="center" alignItems="center">
                        <Avatar src={user.avatar} size={'md'} name={user.name} />
                        <VStack>
                            <Text fontSize={'sm'} fontWeight={'bold'} alignSelf={'start'}>
                                {user.username}
                                <Image src="/verified.png" w="4" h={4} display={'inline-block'} ml={1} />
                            </Text>
                            {posts[0].createdAt !== posts[0].updatedAt && (
                                <Flex color="gray.400" flexDirection={'row'}>
                                    <EditIcon />
                                    <Box
                                        fontSize="small"
                                        fontWeight="bold"
                                        alignSelf="start"
                                        display="inline-block"
                                        ml={1}
                                    >
                                        edited {formatDistanceToNow(new Date(posts[0].updatedAt))} ago
                                    </Box>
                                </Flex>
                            )}
                        </VStack>
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                    <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                        {formatDistanceToNow(new Date(posts[0].createdAt))} ago
                    </Text>

                    {currentUser?._id === user._id && (
                        <>
                            <Button onClick={handleDeletePostOpen} size={'sm'}>
                                <DeleteIcon />
                            </Button>
                            <Button onClick={handleUpdatePostOpen} size={'sm'}>
                                <EditIcon />
                            </Button>
                            <DeletePost post={posts[0]} open={isDeletePostOpen} close={handleDeletePostClose} />
                            <UpdatePost post={posts[0]} open={isUpdatePostOpen} close={handleUpdatePostClose} />
                        </>
                    )}
                </Flex>
            </Flex>

            <Text my={3}>{posts[0].text}</Text>

            {posts[0].img && (
                <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                    <Image src={posts[0].img} w={'full'} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={posts[0]} />
            </Flex>

            {/* <Divider my={4} /> */}

            <Text fontSize={'sm'} color={'gray.500'} align={'end'}>
                Reply section
            </Text>

            <Divider my={4} />

            {posts[0].replies.map((reply) => {
                return (
                    <>
                        <Comment
                            key={reply._id}
                            reply={reply}
                            lastReply={reply._id === posts[0].replies[posts[0].replies.length - 1]._id}
                        />
                    </>
                );
            })}
        </>
    );
};

export default PostPage;
