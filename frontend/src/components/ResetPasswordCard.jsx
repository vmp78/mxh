import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import { redirect, useNavigate, useParams } from 'react-router-dom';

export default function ResetPasswordCard() {
    const { userid, token } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const setUser = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const navigate = useNavigate();

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
            const res = await fetch(`/api/users/reset-password/${userid}/${token}`, {
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
            navigate('/auth');
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex align={'center'} justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Box rounded={'lg'} boxShadow={'lg'} p={8} w={{ base: 'full', sm: '400px' }} bgColor={'gray.900'}>
                    <Stack spacing={8} mb={4}>
                        <Heading fontSize={'3xl'} textAlign={'center'}>
                            Reset password
                        </Heading>
                        <FormControl isRequired>
                            <FormLabel>New Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                    value={inputs.password}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                                    value={inputs.confirmPassword}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() =>
                                            setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword)
                                        }
                                    >
                                        {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Logging in..."
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
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
