import { X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore.js'
import { useChatStore } from '../store/useChatStore.js'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'





const ChatHeader = () => {

    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const navigate = useNavigate();

    //set selected user to null if press back button
    useEffect(() => {

        if (selectedUser) {
            window.history.pushState(null, "", window.location.href); //remove chat id from url
        }

        const handleBackButton = () => {

            if (selectedUser) {
                setSelectedUser(null); //close chat on press back button
                return;
            }

            navigate(-1); //Default back button if no chat is open
        };

        window.onpopstate = handleBackButton;

        return () => {
            window.onpopstate = null; //cleanup
        }


    }, [selectedUser, navigate]);




    return (
        <div className='p-2.5 border-b border-base-300'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>

                    {/* Avatar */}
                    <div className='avatar'>
                        <div className='size-10 rounded-full relative'>
                            <img src={selectedUser.profilepic || "/avatar.png"} alt={selectedUser.fullName} />
                        </div>

                    </div>
                    {/* User info */}
                    <div>
                        <h3 className='font-medium'>{selectedUser.fullName}</h3>
                        <p className='text-sm text-base-content/70'>
                            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>

                {/* close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader