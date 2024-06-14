import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';

export default function EmailCard() {
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();

    const [inputs, setInputs] = useState({
        email: '',
    });

    const handleSendEmail = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', 'Could not send email', 'error');
                return;
            }
            showToast('Success', `Email sent to ${inputs.email}`, 'success');
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
                    <Stack spacing={4}>
                        <Heading fontSize={'2xl'} textAlign={'center'} color={'whitesmoke'}>
                            Reset Password
                        </Heading>
                        <FormControl isRequired>
                            <FormLabel color={'whitesmoke'}>Email</FormLabel>
                            <Input
                                type="text"
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                                value={inputs.email}
                            />
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Sending email..."
                                size="lg"
                                color={'black'}
                                bg={'gray.300'}
                                _hover={{
                                    bg: 'gray.100',
                                }}
                                onClick={handleSendEmail}
                                isLoading={loading}
                            >
                                Send email
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
