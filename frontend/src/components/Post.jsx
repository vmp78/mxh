import { DeleteIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsAtom } from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import Actions from './Actions';
 
const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loadingDelete, setLoadingDelete] = useState(false);
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
 
    // console.log('This is a post', post);
 
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
 
    const handleDeletePost = async () => {
        setLoadingDelete(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Post deleted', 'success');
            setPosts(posts.filter((p) => p._id !== post._id));
        } catch (error) {
            showToast('Error', error.message, 'error');
        } finally {
            setLoadingDelete(false);
        }
    };
 
    if (!user) return null;
    return (
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
            <Flex flex={1} flexDirection={'column'} gap={2}>
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
 
                        {currentUser?._id === user._id && (
                            <>
                                <Button onClick={onOpen} size={'sm'}>
                                    <DeleteIcon />
                                </Button>
 
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay />
                                    <ModalContent bgColor={useColorModeValue('gray.300', 'gray.dark')}>
                                        <ModalHeader>Delete post</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <Text>Are you sure want to delete this post?</Text>
                                            <Stack spacing={10} pt={6} pb={3}>
                                                <Button
                                                    loadingText="Deleting..."
                                                    size="lg"
                                                    colorScheme="red"
                                                    onClick={handleDeletePost}
                                                    isLoading={loadingDelete}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </ModalBody>
                                    </ModalContent>
                                </Modal>
                            </>
                        )}
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
    );
};
 
export default Post;
