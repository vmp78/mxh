import { AddIcon } from '@chakra-ui/icons';
import {Button, useColorModeValue, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
        ModalFooter, FormControl, Textarea, Text, Input, Image, Flex, CloseButton,} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import postsAtom from '../atoms/postsAtom';
const MAX_CHAR = 500;
    

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);

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

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Post created successfully', 'success');
            setPosts([data, ...posts]);
            onClose();
            setPostText('');
            setImgUrl('');
            setRemainingChar(MAX_CHAR);
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <Button
                position={'fixed'}
                bottom={10}
                right={10}
                leftIcon={<AddIcon />}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                onClick={onOpen}
            ></Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor={useColorModeValue('gray.300', 'gray.dark')}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder="Post content goes here.."
                                onChange={handleTextChange}
                                value={postText}
                            />
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
                        <Button colorScheme="blue" onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export default CreatePost;
