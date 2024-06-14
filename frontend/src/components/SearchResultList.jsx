import { Avatar, Box, Card, Flex, Spinner, Stack, StackDivider, Text, useColorMode } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const SearchResultList = ({ users, w, loading }) => {
    const { colorMode } = useColorMode();
    return (
        <Card
            id="searchResultList"
            bgColor={colorMode === 'dark' ? 'black' : 'white'}
            position="absolute"
            top="100%"
            left="0"
            right="0"
            zIndex={999}
            w={w}
            mt={2}
            p={2}
        >
            <Stack>
                {users && !loading ? (
                    users.length > 0 ? (
                        users.map((user) => {
                            return (
                                <Card
                                    border={'none'}
                                    bgColor={colorMode === 'dark' ? 'black' : 'white'}
                                    p={2}
                                    _hover={{ bg: colorMode === 'dark' ? 'gray.800' : 'gray.300', cursor: 'pointer' }}
                                    as={Link}
                                    to={`${user.username}`}
                                    key={user.username}
                                >
                                    <Flex align="center" border={'none'}>
                                        <Avatar src={user.avatar} />
                                        <Box ml={2}>
                                            <Text
                                                fontSize={'sm'}
                                                fontWeight={'bold'}
                                                color={colorMode === 'dark' ? 'white' : 'black'}
                                            >
                                                {user.username}
                                            </Text>
                                            <Text color={colorMode === 'dark' ? 'white' : 'black'} fontSize={'sm'}>
                                                {user.name}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Card>
                            );
                        })
                    ) : (
                        <Card bgColor={'gray.dark'} p={2}>
                            <Flex align="center">
                                <Text color={'white'} fontSize={'sm'}>
                                    No user found
                                </Text>
                            </Flex>
                        </Card>
                    )
                ) : (
                    <Card bgColor={'gray.dark'} p={2}>
                        <Flex align="center">
                            <Spinner size={'md'} />
                        </Flex>
                    </Card>
                )}
            </Stack>
        </Card>
    );
};

export default SearchResultList;
