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
    Square,
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
                <Flex direction={'column'} justifyContent={'center'}>
                    <Square>
                        <Text fontSize={'2xl'} fontWeight={'semibold'}>
                            Phúc Nguyễn Đình
                        </Text>
                    </Square>
                    <Box>
                        <Text fontSize={'sm'}>phuc_1411-_</Text>
                    </Box>
                </Flex>
                <Box>
                    <Avatar name="Nguyen Dinh Phuc" src="/avatar.JPG" size={{ base: 'md', md: 'xl' }} />
                </Box>
            </Flex>

            <Text>Test bio</Text>
            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>6 followers</Text>
                </Flex>

                <Flex>
                    <Box className="icon-container">
                    <Link href={`https://www.instagram.com/`} target='_blank'>
                        <BsInstagram size={24} cursor={'pointer'} />
                    </Link>
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
