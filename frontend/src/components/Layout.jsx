// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Collapse, Nav } from 'react-bootstrap';
import {
  FaTachometerAlt,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaUserCog,
  FaBuilding,
  FaList
} from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const fullName = localStorage.getItem('fullname') || 'User';
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserManagement = () => {
    setUserManagementOpen(!userManagementOpen);
  };

  useEffect(() => {
    if (location.pathname.includes('roles')) setActiveMenuItem('roles');
    else if (location.pathname.includes('department')) setActiveMenuItem('department');
    else if (location.pathname.includes('userList')) setActiveMenuItem('userlist');
    else setActiveMenuItem('dashboard');
  }, [location.pathname]);

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <Header
        userName={fullName}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div style={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div
          style={{
            width: sidebarOpen ? '280px' : '0',
            minWidth: sidebarOpen ? '280px' : '0',
            height: 'calc(100vh - 60px)',
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
            boxShadow: sidebarOpen ? '4px 0 12px rgba(0,0,0,0.08)' : 'none',
            borderRight: sidebarOpen ? '1px solid #e5e7eb' : 'none',
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'sticky',
            top: '60px',
            zIndex: 1000
          }}
        >
          {sidebarOpen && (
            <div className="px-3 py-4" style={{ width: '280px' }}>
              <h6 style={{
                color: '#6b7280',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '16px',
                letterSpacing: '0.05em'
              }}>
                Navigation
              </h6>
              <Nav className="flex-column">
                <Nav.Link
                  href="#"
                  className={`fw-semibold mb-2 d-flex align-items-center ${activeMenuItem === 'dashboard' ? 'active' : ''}`}
                  style={{
                    backgroundColor: activeMenuItem === 'dashboard' ? '#dbeafe' : 'transparent',
                    color: activeMenuItem === 'dashboard' ? '#1d4ed8' : '#374151',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    border: activeMenuItem === 'dashboard' ? '1px solid #bfdbfe' : '1px solid transparent',
                    fontSize: '0.9rem'
                  }}
                  onClick={() => navigate('/dashboard')}
                >
                  <FaTachometerAlt className="me-3" size={16} />
                  Dashboard
                </Nav.Link>

                <div className="mb-2">
                  <Nav.Link
                    href="#"
                    className="fw-semibold d-flex align-items-center justify-content-between"
                    style={{
                      backgroundColor: userManagementOpen ? '#f3f4f6' : 'transparent',
                      color: '#374151',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '0.9rem'
                    }}
                    onClick={toggleUserManagement}
                  >
                    <div className="d-flex align-items-center">
                      <FaUsers className="me-3" size={16} />
                      User Management
                    </div>
                    {userManagementOpen ? (
                      <FaChevronDown size={12} style={{ color: '#6b7280' }} />
                    ) : (
                      <FaChevronRight size={12} style={{ color: '#6b7280' }} />
                    )}
                  </Nav.Link>

                  <Collapse in={userManagementOpen}>
                    <div className="ps-3 mt-2">
                      <Nav.Link
                        href="#"
                        className={`fw-normal mb-2 d-flex align-items-center ${activeMenuItem === 'roles' ? 'active' : ''}`}
                        style={{
                          backgroundColor: activeMenuItem === 'roles' ? '#dbeafe' : 'transparent',
                          color: activeMenuItem === 'roles' ? '#1d4ed8' : '#6b7280',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          fontSize: '0.85rem'
                        }}
                        onClick={() => navigate('/userManagement/roles')}
                      >
                        <FaUserCog className="me-3" size={14} />
                        Roles
                      </Nav.Link>

                      <Nav.Link
                        href="#"
                        className={`fw-normal mb-2 d-flex align-items-center ${activeMenuItem === 'department' ? 'active' : ''}`}
                        style={{
                          backgroundColor: activeMenuItem === 'department' ? '#dbeafe' : 'transparent',
                          color: activeMenuItem === 'department' ? '#1d4ed8' : '#6b7280',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          fontSize: '0.85rem'
                        }}
                        onClick={() => navigate('/userManagement/department')}
                      >
                        <FaBuilding className="me-3" size={14} />
                        Department
                      </Nav.Link>

                      <Nav.Link
                        href="#"
                        className={`fw-normal mb-2 d-flex align-items-center ${activeMenuItem === 'userlist' ? 'active' : ''}`}
                        style={{
                          backgroundColor: activeMenuItem === 'userlist' ? '#dbeafe' : 'transparent',
                          color: activeMenuItem === 'userlist' ? '#1d4ed8' : '#6b7280',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          fontSize: '0.85rem'
                        }}
                        onClick={() => navigate('/userManagement/userList')}
                      >
                        <FaList className="me-3" size={14} />
                        User List
                      </Nav.Link>
                    </div>
                  </Collapse>
                </div>
              </Nav>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f9fafb',
            minHeight: 'calc(100vh - 60px)',
            overflowX: 'hidden'
          }}
        >
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
