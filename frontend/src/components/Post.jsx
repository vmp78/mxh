import { Flex, Avatar, Box, Text, Image } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import Actions from './Actions';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import {DeleteIcon} from '@chakra-ui/icons';
import {formatDistanceToNow} from "date-fns";
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const Post = ({post,postedBy}) => {
    const [user,setUser]= useState(null);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const navigate=useNavigate();

    // fetch user 
    useEffect(()=>{
        const getUser= async()=>{
            try {
                const res = await fetch ("/api/users/profile/"+ postedBy);
                const  data = await res.json();
                if(data.error){
                    showToast("Error", data.error,"error");
                    return;
                }
                setUser(data)
            } catch (error) {
                showToast("Error",error.message, "error");
                setUser(null);
            }
        };
        getUser();
    },[postedBy,showToast]);

    const handleDeletePost = async (e) => {
        try {
            e.preventDefault();
            if(!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`/api/posts/${post._id}`,{
                method:"DELETE",
            });
            const data= await res.json();
            if(data.error){
                showToast("Error", data.error,"error");
                return;
            }
            showToast("Success","Post deleted","success");
        } catch (error) {
            showToast("Error",error.message, "error");
        }
    }

    if(!user) return null;
    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                {/*left side post*/}
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar size={'md'} name={user?.name} src={user?.avatar} 
                    onClick={(e)=>{
                        e.preventDefault();
                        navigate(`/${user.username}`)
                    }}/>
                    <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                        {post.replies[0]&&(
                            <Avatar
                            size={'xs'}
                            name="lala"
                            src={post.replies[0].avatar}
                            position={'absolute'}
                            top={'0px'}
                            left={'15px'}
                            padding={'2px'}
                        />
                        )}
                        
                        {post.replies[1] && (
                            <Avatar
                            size={'xs'}
                            name="lala"
                            src={post.replies[1].avatar}
                            position={'absolute'}
                            bottom={'0px'}
                            right={'-5px'}
                            padding={'2px'}
                        />
                        )}

                        {post.replies[2] && (
                            <Avatar
                            size={'xs'}
                            name="lala"
                            src={post.replies[2].avatar}
                            position={'absolute'}
                            bottom={'0px'}
                            left={'4px'}
                            padding={'2px'}
                        />
                        )}
                        
                    </Box>
                </Flex>
                {/*right side post */}
                <Flex flex={1} flexDirection={'column'} gap={1}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'} fontWeight={'bold'}
                            onClick={(e)=>{
                                e.preventDefault();
                                navigate(`/${user.username}`)
                            }}
                            >
                                {user?.username}
                            </Text>
                            <Image src="/public/verified.png" w={4} h={4} ml={1} />
                        </Flex>

                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>

                            {currentUser._id === user._id && (
                                <DeleteIcon size={20}  onClick={handleDeletePost}/>
                            )}
                            <BsThreeDots />
                        </Flex>
                    </Flex>

                    <Text fontSize={'sm'}>{post.text}</Text>
                    {/*Post with image or not */}
                    {post.img && (
                        <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                            <Image src={post.img} w={'full'} />
                        </Box>
                    )}

                    {/*Actions part*/}
                    <Flex gap={3} my={1}>
                        <Actions post= { post } />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
