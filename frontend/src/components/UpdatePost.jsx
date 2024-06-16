import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState } from 'recoil';
import { postsAtom } from '../atoms/postsAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';
const MAX_CHAR = 500;

const UpdatePost = ({ post, open, close }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [postText, setPostText] = useState(post.text);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg({ url: post.img });
    const imageRef = useRef(null);
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
        setImgUrl(post.img);
    };

    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleUpdatePost = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts/update/${post.postedBy}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: post._id, text: postText, img: imgUrl }),
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Post updated successfully!', 'success');
            handleClose();
            setPostText('');
            setImgUrl('');
            setRemainingChar(MAX_CHAR);
            window.location.reload();
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent bgColor={useColorModeValue('gray.300', 'gray.dark')}>
                <ModalHeader>Edit Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <Textarea placeholder="Post content goes here.." onChange={handleTextChange} value={postText} />
                        <Text fontSize="xs" fontWeight="bold" textAlign="right" m={'1'} color={'gray.light'}>
                            {remainingChar}/{MAX_CHAR}
                        </Text>
                        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />

                        <BsFillImageFill
                            style={{ marginLeft: '5px', cursor: 'pointer' }}
                            size={16}
                            onClick={() => imageRef.current.click()}
                        />
                    </FormControl>

                    {imgUrl && (
                        <Flex mt={5} w={'full'} position={'relative'}>
                            <Image src={imgUrl} alt="Selected img" />
                            <CloseButton
                                onClick={() => {
                                    setImgUrl('');
                                }}
                                bg={useColorModeValue('gray.300', 'gray.900')}
                                color={useColorModeValue('white.200', 'white.900')}
                                _hover={{ backgroundColor: useColorModeValue('gray.100', 'gray.700') }}
                                position={'absolute'}
                                top={2}
                                right={2}
                            />
                        </Flex>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleUpdatePost} isLoading={loading}>
                        Edit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default UpdatePost;
