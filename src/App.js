import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import FreePostList from './pages/FreePost/FreePostList'; 
import FreePostDetail from './pages/FreePost/FreePostDetail';
import FreePostWrite from './pages/FreePost/FreePostWrite';
import QnaPostList from './pages/QnaPost/QnaPostList'; 
import QnaPostDetail from './pages/QnaPost/QnaPostDetail';
import QnaPostWrite from './pages/QnaPost/QnaPostWrite';
import TipPostList from './pages/TipPost/TipPostList'; 
import TipPostDetail from './pages/TipPost/TipPostDetail';
import TipPostWrite from './pages/TipPost/TipPostWrite';
import MainPage from './pages/Main/MainPage'; // 추가


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} /> 
        <Route path="/freeboard" element={<FreePostList />} />
        <Route path="/freeboard/:postId" element={<FreePostDetail />} /> 
        <Route path="/freeboard/write" element={<FreePostWrite />} />
        <Route path="/qna" element={<QnaPostList />} />
        <Route path="/qna/:postId" element={<QnaPostDetail />} /> 
        <Route path="/qna/write" element={<QnaPostWrite />} />
        <Route path="/tip" element={<TipPostList />} />
        <Route path="/tip/:postId" element={<TipPostDetail />} /> 
        <Route path="/tip/write" element={<TipPostWrite />} />
        
      </Routes>
    </Router>
  );
}


export default App;

