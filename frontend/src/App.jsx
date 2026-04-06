import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Landing() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Welcome to the App - Landing Page</h1>

      <SignedOut>
        <SignInButton mode="modal">
          Log In
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  )
}

function VideoCalls() {
  return (
    <div>
      <h1>Video Calls Page</h1>
      <p>This is the video calls page.</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/video-calls" element={<VideoCalls />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
