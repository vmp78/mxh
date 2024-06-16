import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Stack,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';

const DeletePost = ({ post, open, close }) => {
    const user = useRecoilValue(userAtom);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loadingDelete, setLoadingDelete] = useState(false);
    const showToast = useShowToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (open) onOpen();
        else {
            onClose();
        }
    }, [open, onOpen, onClose]);

    const handleClose = () => {
        onClose();
        close();
    };

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
            handleClose();
            navigate(`/${user.username}`);
        } catch (error) {
            showToast('Error', error.message, 'error');
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
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
    );
};
export default DeletePost;
