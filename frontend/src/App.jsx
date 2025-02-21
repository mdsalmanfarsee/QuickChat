import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'

import HomePage from './pages/Homepage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'


import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'



const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  //console.log("onlineUsers: ", onlineUsers); //for debug purposes

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  //console.log({ authUser }); //for debug purposes
  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen' data-theme={theme}>
        <Loader className='size-10 animate-spin bg-base-100' />
      </div>
    )
  }


  return (
    <div data-theme={theme}>

      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />

    </div>
  )
}



export default App