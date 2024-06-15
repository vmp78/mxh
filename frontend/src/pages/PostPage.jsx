import { DeleteIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Input,
    Divider,
    Flex,
    Image,
    Spinner,
    Text,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsAtom } from '../atoms/postsAtom';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';
 
const DeletePostButton = ({ onOpen }) => {
    return (
        <Button onClick={onOpen} size={'sm'}>
            <DeleteIcon />
        </Button>
    );
};
 
const PostPage = () => {
    const { pid } = useParams();
    const { user, loading } = useGetUserProfile();
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
 
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
 
    const handleDeletePost = async () => {
        setLoadingDelete(true);
        try {
            const res = await fetch(`/api/posts/${posts._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Post deleted', 'success');
            navigate(`/${user.username}`);
        } catch (error) {
            showToast('Error', error.message, 'error');
        } finally {
            setLoadingDelete(false);
        }
    };
 
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
                    <Avatar src={user.avatar} size={'md'} name={user.name} />
                    <Flex>
                        <Text fontSize={'sm'} fontWeight={'bold'}>
                            {user.username}
                        </Text>
                        <Image src="/verified.png" w="4" h={4} ml={4} />
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                    <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                        {formatDistanceToNow(new Date(posts[0].createdAt))} ago
                    </Text>
 
                    {currentUser?._id === user._id && <DeletePostButton onOpen={onOpen} />}
                </Flex>
            </Flex>
 
            {currentUser?._id === user._id && (
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
            )}
 
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