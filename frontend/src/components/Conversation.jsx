import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorModeValue } from '@chakra-ui/react';
import { BsCheck2All, BsImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';

const Conversation = ({ conversation, isOnline }) => {
    const user = conversation.participants[0];
    const currentUser = useRecoilValue(userAtom);
    const lastMessage = conversation.lastMessage;
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

    console.log('selectedConverstion', selectedConversation);
    return (
        <Flex
            gap={4}
            alignItems={'center'}
            p={'1'}
            _hover={{
                cursor: 'pointer',
                bg: useColorModeValue('gray.600', 'gray.500'),
                color: 'white',
            }}
            onClick={() =>
                setSelectedConversation({
                    _id: conversation._id,
                    userId: user._id,
                    userAvatar: user.avatar,
                    username: user.username,
                    mock: conversation.mock,
                })
            }
            bg={selectedConversation?._id === conversation._id ? useColorModeValue('gray.300', 'gray.700') : ''}
            borderRadius={'md'}
        >
            <WrapItem>
                <Avatar
                    size={{
                        base: 'xs',
                        sm: 'sm',
                        md: 'md',
                    }}
                    src={user.avatar}
                >
                    {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ''}
                </Avatar>
            </WrapItem>

            <Stack direction={'column'} fontSize={'sm'}>
                <Text fontWeight="700" display={'flex'} alignItems={'center'}>
                    {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
                <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
                    {currentUser._id === lastMessage.sender ? (
                        <Box color={lastMessage.seen ? 'blue.400' : ''}>
                            <BsCheck2All size={16} />
                        </Box>
                    ) : (
                        ''
                    )}
                    {lastMessage.text.length > 18
                        ? lastMessage.text.substring(0, 18) + '...'
                        : lastMessage.text || <BsImageFill size={16} />}
                </Text>
            </Stack>
        </Flex>
    );
};

export default Conversation;
