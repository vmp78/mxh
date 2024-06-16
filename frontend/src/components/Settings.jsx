import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useShowToast from '../hooks/useShowToast';

const Settings = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const showToast = useShowToast();
    const logout = useLogout();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleResetPassword = async () => {
        if (inputs.password !== inputs.confirmPassword) {
            showToast('Error', 'Passwords do not match', 'error');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/users/change-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Password changed successfully', 'success');
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };

    const freezeAccount = async () => {
        if (!window.confirm('Are you sure you want to freeze your account?')) return;

        try {
            const res = await fetch('/api/users/freeze', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();

            if (data.error) {
                return showToast('Error', data.error, 'error');
            }
            if (data.success) {
                await logout();
                showToast('Success', 'Your account has been frozen', 'success');
            }
        } catch (error) {
            showToast('Error', error.message, 'error');
        }
    };

    return (
        <Flex flexDirection="column" h="full">
            <Accordion allowMultiple maxW={'100%'}>
                <AccordionItem border={'none'}>
                    <AccordionButton _expanded={{ bg: 'gray.500', color: 'white' }}>
                        <Box as="span" flex="1" textAlign="left">
                            Freeze Your Account
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <Text my={1}>
                            By doing this, no one will be able to reach your account. You can unfreeze your account
                            anytime by logging in.
                        </Text>
                        <Button size={'sm'} colorScheme="red" onClick={freezeAccount} mt={2} width={'100%'}>
                            Freeze
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem border={'none'} mt={2}>
                    <AccordionButton _expanded={{ bg: 'gray.500', color: 'white' }}>
                        <Box as="span" flex="1" textAlign="left">
                            Change color mode
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <Text my={1}>Change between dark and light mode.</Text>
                        <Button
                            size={'sm'}
                            colorScheme={colorMode === 'dark' ? 'orange' : 'blue'}
                            onClick={toggleColorMode}
                            mt={2}
                            width={'100%'}
                        >
                            {colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            <Spacer />
            <Divider my={4} />
            <Button
                size={'sm'}
                colorScheme={colorMode === 'dark' ? 'gray' : 'blue'}
                variant="solid"
                width={'100%'}
                mb={2}
                onClick={onOpen}
            >
                Change password
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor={useColorModeValue('gray.300', 'gray.dark')}>
                    <ModalHeader>Change password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>New Password</FormLabel>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                value={inputs.password}
                            />
                        </FormControl>
                        <FormControl isRequired mt={5}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                                value={inputs.confirmPassword}
                            />
                        </FormControl>
                        <Stack spacing={10} pt={6} pb={3}>
                            <Button
                                loadingText="Changing..."
                                size="lg"
                                color={'black'}
                                bg={'gray.300'}
                                _hover={{
                                    bg: 'gray.100',
                                }}
                                onClick={handleResetPassword}
                                isLoading={loading}
                            >
                                Change
                            </Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default Settings;
