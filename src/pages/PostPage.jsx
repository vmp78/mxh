import { Flex, Avatar, Text, Image, Box, Divider, Button } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from '../components/Actions';
import { useState } from 'react';
import Comments from '../components/Comments';

const PostPage = () => {
    const [liked, setLiked] = useState(false);
    return (
        <>
            <Flex>
                <Flex w={'full'} alignItems={'center'} gap={3}>
                    <Avatar src="/public/avatar.JPG" size={'md'} name="phuc" />
                    <Flex>
                        <Text fontSize={'sm'} fontWeight={'bold'}>
                            phucnguyendinh
                        </Text>
                        <Image src="/public/verified.png" w={4} h={4} ml={2} mt={1} />
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                    <Text fontSize={'sm'} color={'gray.light'}>
                        1d
                    </Text>
                    <BsThreeDots />
                </Flex>
            </Flex>
            <Text my={3}>Some post goes in here...</Text>
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                <Image src="/public/post1.jpg" w={'full'} />
            </Box>

            <Flex gap={3} my={3}>
                <Actions liked={liked} setLiked={setLiked} />
            </Flex>

            <Flex gap={2} alignItems={'center'}>
                <Text color={'gray.light'} fontSize={'sm'}>
                    2 replies
                </Text>
                <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
                <Text color={'gray.light'} fontSize={'sm'}>
                    {200 + (liked ? 1 : 0)} likes
                </Text>
            </Flex>

            <Divider my={3} />

            <Flex justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'2xl'}>🍔</Text>
                    <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
                </Flex>
                <Button>Get</Button>
            </Flex>

            <Divider my={4} />
            <Comments
                avatar={'/public/avatar.JPG'}
                username={'phucnguyendinh'}
                comment={'Great post!!'}
                likes={100}
                createdAt={'2d'}
            />
            <Comments
                avatar={'https://bit.ly/prosper-baba'}
                username={'Kent Dodds'}
                comment={'not too bad!'}
                likes={0}
                createdAt={'1d'}
            />
            <Comments
                avatar={'https://bit.ly/ryan-florence'}
                username={'Prosper Otemuyiwa'}
                comment={'Hahaha!!'}
                likes={1}
                createdAt={'3d'}
            />
        </>
    );
};

export default PostPage;
