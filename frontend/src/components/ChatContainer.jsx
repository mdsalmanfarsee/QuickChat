import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore.js'
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMessageTime } from '../lib/utils.js';
import { Check, CheckCheck } from "lucide-react"; // Lucide icons

import MessageInput from './MessageInput.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';
import EncryptionNotice from './EncryptionNotice.jsx';





const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();

    const messagesEndRef = useRef(null); // Ref to track the end of messages
    const chatContainerRef = useRef(null); // Ref to track the chat container
    const [isAtBottom, setIsAtBottom] = useState(true); // Track if user is at the bottom of the chat

    useEffect(() => {

        getMessages(selectedUser._id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [messages, selectedUser, getMessages, unsubscribeFromMessages, subscribeToMessages]);


    // Scroll to bottom when messages change
    // useEffect(() => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, [messages]);


    // Detect if user scrolls up manually
    useEffect(() => {
        const handleScroll = () => {
            if (chatContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
                const bottomThreshold = 50; // Allow some margin

                // User is at the bottom if they are within 50px of the bottom
                setIsAtBottom(scrollHeight - scrollTop - clientHeight < bottomThreshold);
            }
        };

        if (chatContainerRef.current) {
            chatContainerRef.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    // Auto-scroll only when new messages arrive AND user is at bottom
    useEffect(() => {
        if (isAtBottom && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isAtBottom]);






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


            <div ref={chatContainerRef} className='flex-1 overflow-y-auto p-4 space-y-4'>
                <EncryptionNotice />
                {messages.map((message, index) => {

                    const isLastSentMessage = message.senderId === authUser._id && (index === messages.length - 1);
                    //|| messages[index + 1]?.senderId !== authUser._id




                    return (
                        <div
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                            ref={messagesEndRef}
                        >
                            <div className='chat-image avatar'>
                                <div className='size-10 rounded-full border'>
                                    <img src={message.senderId === authUser._id ? authUser.profilepic || "/avatar.png" :
                                        selectedUser.profilepic || "/avatar.png"}
                                        alt='profile pic'
                                    />
                                </div>
                            </div>

                            <div className='chat-header mb-1'>
                                <time className='text-xs opacity-50 ml-1'>
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div className={`chat-bubble flex flex-col rounded-xl shadow-sm 
                                ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}`}>
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt='attachment'
                                        className='sm:max-w-[200px] rounded-md mb-2'
                                    />
                                )}
                                {message.text && (<p>{message.text}</p>)}


                                {/* Sent/Seen Status for Last Sent Message */}
                                {isLastSentMessage && (
                                    <div className="text-xs flex items-center justify-end mt-1 text-gray-500">
                                        {message.seen === "true" ? (
                                            <>
                                                <CheckCheck size={16} className="text-blue-500 mr-1" /> Seen
                                            </>
                                        ) : (
                                            <>
                                                <Check size={16} className="mr-1" /> Sent
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
                {/* Empty div at the end for smooth scrolling */}
                <div ref={messagesEndRef} />

            </div>

            <MessageInput />
        </div>
    )
}

export default ChatContainer