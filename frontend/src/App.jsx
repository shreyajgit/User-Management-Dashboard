import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './components/registerUser';
import Login from './components/Login'; 
import UserData from './components/VIew'; 
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Users />} />
        <Route path="/login" element={<Login />} />
        {/* Optional: Add more routes like below */}
        <Route path="/view" element={<UserData />} />
<Route path="/home/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
