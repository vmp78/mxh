import {
    Avatar,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';

export default function EditProfilePage() {
    return (
        <Flex align={'center'} justify={'center'}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.dark')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}
            >
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Profile Edit
                </Heading>
                <FormControl id="userName">
                    <Stack direction={['column', 'row']} spacing={6}>
                        <Center>
                            <Avatar size="xl" src="https://bit.ly/sage-adebayo" />
                        </Center>
                        <Center w="full">
                            <Button w="full">Change Avatar</Button>
                        </Center>
                    </Stack>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Full name</FormLabel>
                    <Input placeholder="Nguyen Van A" _placeholder={{ color: 'gray.500' }} type="text" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>User name</FormLabel>
                    <Input placeholder="nguyenvana" _placeholder={{ color: 'gray.500' }} type="text" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input placeholder="your-email@example.com" _placeholder={{ color: 'gray.500' }} type="email" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Bio</FormLabel>
                    <Input placeholder="Your bio goes here..." _placeholder={{ color: 'gray.500' }} type="email" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input placeholder="example-password" _placeholder={{ color: 'gray.500' }} type="password" />
                </FormControl>
                <Stack spacing={6} direction={['column', 'row']}>
                    <Button colorScheme="gray" w="full">
                        Cancel
                    </Button>
                    <Button colorScheme="cyan" w="full">
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
}
