import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore.js'

import MessageInput from './MessageInput.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';





const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, SelectedUser } = useChatStore;

    useEffect(() => {
        if (SelectedUser) {
            getMessages(SelectedUser._id);
        }
    }, [SelectedUser, getMessages]);


    if (isMessagesLoading) return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )



    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <p>messages</p>

            <MessageInput />
        </div>
    )
}

export default ChatContainer