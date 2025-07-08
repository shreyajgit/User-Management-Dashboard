  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Users from './components/RegisterUser';
  import Login from './components/Login'; 
  import PrivateRoute from './components/PrivateRoute';
  import Layout from './components/Layout'; // new layout wrapper
  import Dashboard from './components/Dashboard'; // create new dashboard file
  import Role from './components/Role';
  import Department from './components/Department';
  import UserData from './components/UserList';
  import CreateRoles from './components/CreateRoles';
  

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/register" element={<Users />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="userManagement/roles" element={<Role />} />
            <Route path="userManagement/department" element={<Department />} />
            <Route path="userManagement/userList" element={<UserData />} />
            <Route path="userManagement/roles/createRoles" element={<CreateRoles />} />
          </Route>
        </Routes>
      </Router>
    );
  }

  export default App;
