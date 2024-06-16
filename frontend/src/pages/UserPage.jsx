import { Flex, Heading, Image, Spinner, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';
import Repost from '../components/Repost';
import UserHeader from '../components/UserHeader';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState } from 'recoil';
import { postsAtom, repostsAtom } from '../atoms/postsAtom';

const UserPage = () => {
    const { user, loading } = useGetUserProfile();
    const { username } = useParams();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [reposts, setReposts] = useRecoilState(repostsAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);
    const showToast = useShowToast();

    //eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!user) return;
        const getPostsAndReposts = async () => {
            setFetchingPosts(true);
            try {
                const [postsResponse, repostsResponse] = await Promise.all([
                    fetch(`/api/posts/user/${username}`),
                    fetch(`/api/posts/user/repost/${username}`),
                ]);

                if (!postsResponse.ok || !repostsResponse.ok) {
                    throw new Error('Failed to fetch posts and reposts');
                }

                const postData = await postsResponse.json();
                const repostData = await repostsResponse.json();
                setPosts(postData);
                setReposts(repostData);
            } catch (error) {
                showToast('Error', error.message, 'error');
                setPosts([]);
                setReposts([]);
            } finally {
                setFetchingPosts(false);
            }
        };

        if (user) {
            getPostsAndReposts();
        }
    }, [username, user]);

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'xl'} />
            </Flex>
        );
    }

    if (!user && !loading)
        return (
            <Flex maxW={'xs'} direction={'column'} justify={'center'} alignItems={'center'} mx={'auto'}>
                <Image
                    src="/frozen.png"
                    alt="Frozen account image"
                    borderRadius="lg"
                    maxW={'xs'}
                    alignItems={'center'}
                />
                <Stack mt={3} alignItems={'center'}>
                    <Heading size="md">Oops, user's account is frozen!</Heading>
                </Stack>
            </Flex>
        );

    return (
        <>
            <UserHeader user={user} />

            {fetchingPosts && (
                <Flex justifyContent={'center'} my={12}>
                    <Spinner size={'xl'} />
                </Flex>
            )}

            <Tabs isFitted mt={2} colorScheme="gray">
                <TabList mb="1em">
                    <Tab>Threads</Tab>
                    <Tab>Reposts</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {!fetchingPosts && posts.length > 0 ? (
                            posts.map((post) => (
                                <Post key={post._id + post.updatedAt} post={post} postedBy={post.postedBy} />
                            ))
                        ) : (
                            <h1>User has not posts.</h1>
                        )}
                    </TabPanel>
                    <TabPanel>
                        {!fetchingPosts && reposts.length > 0 ? (
                            reposts.map((repost) => (
                                <Repost key={repost._id} post={repost.post} postedBy={repost.postedBy} />
                            ))
                        ) : (
                            <h1>User has not reposts.</h1>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
};

export default UserPage;
