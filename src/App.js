import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import FreePostList from './pages/FreePost/FreePostList'; 
import FreePostDetail from './pages/FreePost/FreePostDetail';
import FreePostWrite from './pages/FreePost/FreePostWrite';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/freeboard" element={<FreePostList />} />
        <Route path="/freeboard/:postId" element={<FreePostDetail />} /> 
        <Route path="/freeboard/write" element={<FreePostWrite />} />
        
      </Routes>
    </Router>
  );
}


export default App;

