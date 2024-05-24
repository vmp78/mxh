import {
    Avatar,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState ,useRef} from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import showToast from '../hooks/useShowToast';

export default function EditProfilePage() {
    const [user,setUser]= useRecoilState(userAtom)
    const [inputs,setInputs]= useState({
        name:user.name,
        username:user.username,
        email:user.email,
        bio:user.bio,
        password:"",
        avatar:"",
    });
    const fileRef= useRef(null);

    const {handleImageChange, imgUrl}= usePreviewImg()
    const handleSubmit = async(e) =>{
        e.preventDefault();

        try {
            const res = await fetch(`/api/users/update/${user._id}`,{
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...inputs, avatar : imgUrl}),
            })
            const data = await res.json();
            console.log(data);
        } catch (error) {
            showToast('Error',error, 'error');
        }
    }
    return (
        <form onSubmit={handleSubmit}>
        <Flex align={'center'} justify={'center'}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.dark')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}
            >
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Profile Edit
                </Heading>
                <FormControl id="userName">
                    <Stack direction={['column', 'row']} spacing={6}>
                        <Center>
                            <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.avatar} />
                        </Center>
                        <Center w="full">
                            <Button w="full" onClick={() => fileRef.current.click()}>
                                Change Avatar
                                </Button>
                            <Input type="file" hidden ref={fileRef} onChange ={handleImageChange}/> 
                        </Center>
                    </Stack>
                </FormControl>
                <FormControl>
                    <FormLabel>Full name</FormLabel>
                    <Input placeholder="Nguyen Van A" 
                    onChange= {(e)=> setInputs({...inputs, name:e.target.value})}
                    value={inputs.name}
                    _placeholder={{ color: 'gray.500' }} type="text" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>User name</FormLabel>
                    <Input placeholder="nguyenvana" 
                    onChange= {(e)=> setInputs({...inputs, username :e.target.value})}
                    value={inputs.username}
                    _placeholder={{ color: 'gray.500' }} type="text" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input placeholder="your-email@example.com" 
                    onChange= {(e)=> setInputs({...inputs, email :e.target.value})}
                    value={inputs.email}
                    _placeholder={{ color: 'gray.500' }} type="email" />
                </FormControl>
                <FormControl >
                    <FormLabel>Bio</FormLabel>
                    <Input placeholder="Your bio goes here..." 
                    onChange= {(e)=> setInputs({...inputs, bio:e.target.value})}
                    value={inputs.bio}
                    _placeholder={{ color: 'gray.500' }} type="email" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input placeholder="example-password" 
                    onChange= {(e)=> setInputs({...inputs, password:e.target.value})}
                    value={inputs.password}
                    _placeholder={{ color: 'gray.500' }} type="password" />
                </FormControl>
                <Stack spacing={6} direction={['column', 'row']}>
                    <Button colorScheme="gray" w="full">
                        Cancel
                    </Button>
                    <Button colorScheme="cyan" w="full"
                    type ='submit' >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
        </form>
    );
}
