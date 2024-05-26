import {
    VStack,
    Flex,
    Link,
    Box,
    Text,
    MenuButton,
    Menu,
    MenuList,
    MenuItem,
    useToast,
    Square,
    Button,
} from '@chakra-ui/react';
import { Portal } from '@chakra-ui/portal';
import { Avatar } from '@chakra-ui/avatar';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from 'react-router-dom';

const UserHeader = ({ user }) => {
    const toast = useToast();
    const currentUser = useRecoilValue(userAtom); // logged in user
    // const [following,setFollowing]=useState(user.followers.includes(currentUser._id));
    // console.log(following)
    // console.log(user.user.username);

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: 'success',
                status: 'success',
                description: 'Profile link copied!',
                duration: 5000,
                isClosable: true,
            });
        });
    };

    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Flex direction={'column'} justifyContent={'center'}>
                    <Square>
                        <Text fontSize={'2xl'} fontWeight={'semibold'}>
                            {user.user.name}
                        </Text>
                    </Square>
                    <Box>
                        <Text fontSize={'sm'}>{user.user.username}</Text>
                    </Box>
                </Flex>
                <Box>
                    {user.user.avatar && (
                        <Avatar name={user.user.name} src={user.user.avatar} size={{ base: 'md', md: 'xl' }} />
                    )}
                    {!user.user.avatar && (
                        <Avatar name={user.name} src="https://bit.ly/broken-link" size={{ base: 'md', md: 'xl' }} />
                    )}
                </Box>
            </Flex>

            <Text>{user.user.bio}</Text>

            {currentUser._id === user.user._id && (
                <Link as={RouterLink} to="/update">
                    <Button size={'sm'}>Edit Profile</Button>
                </Link>
            )}

            {/* {currentUser._id !== user._id && <Button size={'sm'}>{following ? 'unfollow' : 'Follow'}</Button>} */}

            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>1 followers</Text>
                </Flex>

                <Flex>
                    <Box className="icon-container">
                        <Link href={`https://www.instagram.com/`} target="_blank">
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
                                <MenuItem bg={'gray.dark'} fontWeight={'semibold'} onClick={copyURL}>
                                    Copy link
                                </MenuItem>
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
