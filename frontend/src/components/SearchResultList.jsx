import { Avatar, Box, Card, Flex, Spinner, Stack, StackDivider, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const SearchResultList = ({ users, w, loading }) => {
    return (
        <Card
            id="searchResultList"
            bgColor={'gray.dark'}
            position="absolute"
            top="100%"
            left="0"
            right="0"
            zIndex={999}
            w={w}
            mt={2}
            p={2}
        >
            <Stack divider={<StackDivider />}>
                {users && !loading ? (
                    users.length > 0 ? (
                        users.map((user) => {
                            return (
                                <Card
                                    bgColor={'gray.dark'}
                                    p={2}
                                    _hover={{ bg: 'gray.light', cursor: 'pointer' }}
                                    as={Link}
                                    to={`${user.username}`}
                                    key={user.username}
                                >
                                    <Flex align="center">
                                        <Avatar src={user.avatar} />
                                        <Box ml={2}>
                                            <Text fontSize={'sm'} fontWeight={'bold'}>
                                                {user.username}
                                            </Text>
                                            <Text color={'gray.light'} fontSize={'sm'}>
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
