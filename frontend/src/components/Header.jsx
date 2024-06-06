import { HamburgerIcon } from '@chakra-ui/icons';
import { CSSReset, Flex, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useLayoutEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { LuLogOut, LuMessageCircle, LuSettings, LuUser } from 'react-icons/lu';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useLogout from '../hooks/useLogout';
import SearchBar from './SearchBar';
import SearchResultList from './SearchResultList';

const MenuItemHoverStyles = {
    _hover: {
        backgroundColor: 'gray.800',
    },
};

const Header = () => {
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState('');
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const location = useLocation();

    useLayoutEffect(() => {
        if (!reset) setReset(!reset);
    }, [location]);

    return (
        <>
            <CSSReset />
            <Flex
                justifyContent="center"
                ml={'auto'}
                mr={'auto'}
                maxW={{ base: '620px', md: '900px' }}
                mt={6}
                mb={10}
                gap={20}
            >
                {user && (
                    <Link as={RouterLink} to="/">
                        <AiFillHome size={26} />
                    </Link>
                )}

                {user && (
                    <Flex position="relative">
                        <SearchBar
                            w={'400px'}
                            setUsers={setUsers}
                            setInput={setInput}
                            setLoading={setLoading}
                            reset={reset}
                            location={location}
                        />
                        {users && users.length >= 0 && input.length > 0 && (
                            <SearchResultList users={users} w={'400px'} loading={loading} />
                        )}
                    </Flex>
                )}

                {user && (
                    <Menu>
                        <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="outline" />
                        <MenuList bg="black">
                            <MenuItem as={RouterLink} to={`/${user.username}`} bg="black" _hover={MenuItemHoverStyles}>
                                <LuUser size={26} />
                                <Text ml={2}>Profile</Text>
                            </MenuItem>
                            <MenuItem as={RouterLink} to={`/${user.username}`} bg="black" _hover={MenuItemHoverStyles}>
                                <LuMessageCircle size={26} />
                                <Text ml={2}>Chat</Text>
                            </MenuItem>
                            <MenuItem as={RouterLink} to={`/settings`} bg="black" _hover={MenuItemHoverStyles}>
                                <LuSettings size={26} />
                                <Text ml={2}>Settings</Text>
                            </MenuItem>
                            <MenuItem onClick={logout} bg="black" _hover={MenuItemHoverStyles}>
                                <LuLogOut size={26} />
                                <Text ml={2}>Log out</Text>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}
            </Flex>
        </>
    );
};

export default Header;
