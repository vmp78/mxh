import {
    Flex,
    HStack,
    PinInput,
    PinInputField,
    Stack,
    Box,
    VStack,
    Center,
    Text,
    CSSReset,
    Button,
} from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import userAtom from '../atoms/userAtom';

export default function ResetPasswordCard() {
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom);

    return (
        <Flex align={'center'} justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Box p={8} bgColor={'gray.900'} rounded={'lg'} boxShadow={'lg'} w={{ base: 'full', sm: '400px' }}>
                    <CSSReset />
                    <VStack align="center" spacing={8}>
                        <VStack spacing={0}>
                            <Center>
                                <Text fontSize="3xl" fontWeight="bold" color={'white'}>
                                    Email Verification
                                </Text>
                            </Center>
                            <Center>
                                <Text fontSize="l" color={'gray.200'}>
                                    We have sent a code to your email address
                                </Text>
                            </Center>
                        </VStack>
                        <VStack spacing={4} width="100%">
                            <Text fontSize="lg" color="white">
                                Type in your code:
                            </Text>
                            <HStack>
                                <PinInput otp size={'lg'}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </VStack>
                        <Button
                            mt={2}
                            loadingText="Logging in..."
                            size="lg"
                            w={{ base: 'full', sm: '380px' }}
                            color={'black'}
                            bg={'gray.300'}
                            _hover={{
                                bg: 'gray.100',
                            }}
                        >
                            Verify account
                        </Button>
                    </VStack>
                </Box>
            </Stack>
        </Flex>
    );
}
