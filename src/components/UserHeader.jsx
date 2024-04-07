import {
    VStack,
    Flex,
    Link,
    Box,
    Text,
    MenuButton,
    Menu,
    Portal,
    MenuList,
    MenuItem,
    useToast,
} from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/avatar';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';

const UserHeader = () => {
    const toast = useToast();
    const handleCopyURL = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({ description: 'URL copied to clipboard', duration: 2000 });
        });
    };

    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={'semibold'}>
                        Phúc Nguyễn Đình
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>phuc_1411_</Text>
                        <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar name="Nguyen Dinh Phuc" src="/public/avatar.JPG" size={'xl'} />
                </Box>
            </Flex>

            <Text>Test bio</Text>
            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>6 followers</Text>
                    <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'}></Box> {/*dau cham o giua*/}
                    <Link color={'gray.light'} href={'https://www.instagram.com/'}>
                        instagram.com
                    </Link>
                    {/*link ins o ben canh*/}
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={'pointer'} />
                    </Box>
                    <Menu>
                        <MenuButton>
                            <Box className="icon-container">
                                <CgMoreO size={24} cursor={'pointer'} />
                            </Box>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={'gray.dark'}>
                                <MenuItem bg={'gray.dark'} fontWeight={'semibold'} onClick={handleCopyURL}>
                                    Copy link
                                </MenuItem>

                                {/* <MenuItem bg={'gray.dark'} fontWeight={'semibold'}>
                                    About this profile
                                </MenuItem>
                                <MenuItem bg={'gray.dark'} fontWeight={'semibold'}>
                                    Mute
                                </MenuItem>
                                <MenuItem bg={'gray.dark'} fontWeight={'semibold'}>
                                    Restrict
                                </MenuItem>
                                <MenuItem bg={'gray.dark'} color={'red'} fontWeight={'semibold'}>
                                    Block
                                </MenuItem>
                                <MenuItem bg={'gray.dark'} color={'red'} fontWeight={'semibold'}>
                                    Report
                                </MenuItem> */}
                            </MenuList>
                        </Portal>
                    </Menu>
                </Flex>
            </Flex>

            <Flex w={'full'}>
                <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb={3} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Threads</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={'1.5px solid gray'}
                    justifyContent={'center'}
                    color={'gray.light'}
                    pb={3}
                    cursor={'pointer'}
                >
                    <Text fontWeight={'bold'}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader;
