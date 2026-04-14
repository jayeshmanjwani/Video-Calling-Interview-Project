import {SignedIn,SignedOut,SignInButton,SignOutButton,UserButton, useUser} from "@clerk/clerk-react";
import {Navigate, Route, Routes} from 'react-router';
import HomePage from "./Pages/HomePage";
import ProblemsPage from "./Pages/ProblemsPage";

function App() {
  const {isSignedIn,isLoaded} = useUser();

  // This will get rid of flickering effect 
  if(!isLoaded) return null; 

  return (
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />} />
      <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} /> 
    </Routes>
  )
}

export default App;
