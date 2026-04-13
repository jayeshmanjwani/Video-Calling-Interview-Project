import {SignedIn,SignedOut,SignInButton,SignOutButton,UserButton, useUser} from "@clerk/clerk-react";
import {Navigate, Route, Routes} from 'react-router';
import HomePage from "./Pages/HomePage";
import ProblemsPage from "./Pages/ProblemsPage";

function App() {
  const {isSignedIn} = useUser();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} /> 
    </Routes>
  )
}

export default App;
