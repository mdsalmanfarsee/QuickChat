import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const mode = import.meta.env.OPERATION;
const url = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = mode === "dev" ? 'http://localhost:3001' : url;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');


            set({ authUser: res.data.user });
            get().connectSocket();
        } catch (error) {
            console.log('error in checkAuth:', error);

            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            console.log('res in signup:', res.data);

            set({ authUser: res.data });
            toast.success(res.data.message);

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log('error in signup:', error);
        }
        finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logged out successfully');
            get().disconnectSocket();
        } catch (error) {
            console.log('error in logout:', error);

            toast.error('An error occurred while logging out');
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('auth/login', data);
            set({ authUser: res.data });
            toast.success(res.data.message);

            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
            console.log('error in login:', error);

        }
        finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log('error in update profile picture:', error);
        }
        finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();

        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
            // transports: ["polling", "websocket"], // Force polling first
            // withCredentials: true,
        });
        socket.connect();

        set({ socket: socket });

        socket.on('getOnlineUsers', (users) => {
            set({ onlineUsers: users });
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },

}));