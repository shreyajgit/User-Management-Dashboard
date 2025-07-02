import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import { FaUserCircle, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import logo from "../assets/logo.png";

const Header = ({ userName = "User", onToggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #dee2e6",
        padding: "6px 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden"
      }}
    >
      <Container 
        fluid 
        className="d-flex align-items-center justify-content-between"
        style={{ 
          padding: "0 16px",
          maxWidth: "100%",
          overflowX: "hidden"
        }}
      >
        {/* Left: Hamburger + Logo + Title */}
        <div className="d-flex align-items-center gap-3" style={{ minWidth: 0, flexShrink: 0 }}>
          {onToggleSidebar && (
            <Button
              variant="light"
              size="sm"
              onClick={onToggleSidebar}
              className="d-flex align-items-center justify-content-center border"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "6px",
                flexShrink: 0
              }}
            >
              {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </Button>
          )}

          <Navbar.Brand className="d-flex align-items-center gap-2 m-0" style={{ minWidth: 0 }}>
            <img
              src={logo}
              alt="Logo"
              height="35"
              style={{
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
                padding: "2px",
                flexShrink: 0
              }}
            />
            <div className="d-none d-md-block" style={{ minWidth: 0 }}>
              <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: "1.1rem", whiteSpace: "nowrap" }}>Dashboard</h6>
              <small className="text-muted" style={{ whiteSpace: "nowrap" }}>Admin Panel</small>
            </div>
          </Navbar.Brand>
        </div>

        {/* Center: Search */}
        <div 
          className="mx-auto d-none d-lg-block" 
          style={{ 
            maxWidth: "400px", 
            width: "100%",
            minWidth: 0,
            flex: "0 1 400px"
          }}
        >
          <div className="position-relative">
            <input
              type="text"
              className="form-control pe-5"
              placeholder="Search anything..."
              style={{
                height: "38px",
                fontSize: "0.9rem",
                width: "100%",
                minWidth: 0
              }}
            />
            <FaSearch
              className="position-absolute text-muted"
              style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
              }}
            />
          </div>
        </div>

        {/* Right: User Info + Logout */}
        <Nav className="ms-auto d-flex align-items-center gap-3" style={{ flexShrink: 0, minWidth: 0 }}>
          <div className="d-none d-md-block text-end me-2" style={{ minWidth: 0 }}>
            <div className="fw-semibold text-secondary" style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>Welcome back!</div>
            <div
              className="fw-bold"
              style={{
                color: "#007bff",
                fontSize: "1rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px"
              }}
            >
              {userName}
            </div>
          </div>

          <div className="d-none d-md-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "#f1f1f1",
                flexShrink: 0
              }}
            >
              <FaUserCircle size={20} className="text-secondary" />
            </div>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleLogout}
              style={{
                borderRadius: "20px",
                padding: "6px 16px",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
            >
              Logout
            </Button>
          </div>

          {/* Mobile dropdown */}
          <Dropdown className="d-md-none" style={{ flexShrink: 0 }}>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-user"
              className="p-0 border-0"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#f1f1f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaUserCircle size={20} className="text-secondary" />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" style={{ minWidth: "150px" }}>
              <Dropdown.Header className="fw-semibold text-dark" style={{ 
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "140px"
              }}>
                {userName}
              </Dropdown.Header>
              <Dropdown.Item
                onClick={handleLogout}
                className="text-danger fw-semibold text-center"
              >
                🚪 Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;