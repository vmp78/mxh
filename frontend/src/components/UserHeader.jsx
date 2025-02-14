import {
    Avatar,
    Box,
    Button,
    Flex,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Text,
    VStack,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useFollowUnfollow from '../hooks/useFollowUnfollow';

const UserHeader = ({ user }) => {
    const toast = useToast();
    const currentUser = useRecoilValue(userAtom); // logged in user
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: 'Success.',
                status: 'success',
                description: 'Profile link copied.',
                duration: 5000,
                isClosable: true,
            });
        });
    };

    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>{user.username}</Text>
                        <Text
                            fontSize={'xs'}
                            bg={useColorModeValue('gray.300', 'gray.700')}
                            color={useColorModeValue('gray.800', 'white')}
                            p={1}
                            borderRadius={'full'}
                        >
                            social.net
                        </Text>
                    </Flex>
                    <Text fontSize={'md'} fontStyle={'italic'} mt={2}>
                        {user.bio}
                    </Text>
                </Box>
                <Box>
                    {user.avatar && (
                        <Avatar
                            name={user.name}
                            src={user.avatar}
                            size={{
                                base: 'md',
                                md: 'xl',
                            }}
                        />
                    )}
                    {!user.avatar && (
                        <Avatar
                            name={user.name}
                            src="https://bit.ly/broken-link"
                            size={{
                                base: 'md',
                                md: 'xl',
                            }}
                        />
                    )}
                </Box>
            </Flex>

            {currentUser?._id !== user._id && (
                <Button size={'sm'} onClick={handleFollowUnfollow} isLoading={updating}>
                    {following ? 'Unfollow' : 'Follow'}
                </Button>
            )}
            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>{user.followers.length} followers</Text>
                </Flex>
                <Flex>
                    <Box
                        className="icon-container"
                        _hover={{ backgroundColor: useColorModeValue('gray.200', 'gray.700') }}
                    >
                        <BsInstagram size={24} cursor={'pointer'} />
                    </Box>
                    <Box
                        className="icon-container"
                        _hover={{ backgroundColor: useColorModeValue('gray.200', 'gray.700') }}
                    >
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={'pointer'} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={useColorModeValue('gray.200', 'gray.900')}>
                                    <MenuItem bg={useColorModeValue('gray.200', 'gray.900')} onClick={copyURL}>
                                        Copy link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            {currentUser?._id === user._id && (
                <Link as={RouterLink} to="/update" w={'full'}>
                    <Button size={'sm'} colorScheme="gray" borderWidth={2} width={'100%'}>
                        Edit Profile
                    </Button>
                </Link>
            )}
        </VStack>
    );
};

export default UserHeader;
