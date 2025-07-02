import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaHeart, FaLinkedin, FaTwitter, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const linkHoverStyle = {
    color: 'white',
    paddingLeft: '5px',
  };

  const linkDefaultStyle = {
    transition: 'all 0.3s ease',
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
  };

  return (
    <footer
      className="mt-auto"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #4f46e5 100%)',
        color: 'white',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '0.9rem',
        width: '100%',
        overflowX: 'hidden',
        maxWidth: '100vw' // Prevent footer from exceeding viewport width
      }}
    >
      {/* Top Section */}
      <Container fluid className="py-5" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <Row className="justify-content-center" style={{ margin: '0', padding: '0 15px' }}>
          <Col lg={10} style={{ maxWidth: '100%' }}>
            <Row style={{ margin: '0' }}>
              {/* Company Info */}
              <Col md={4} className="mb-4" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <h5 className="fw-bold mb-3">Admin Dashboard</h5>
                <p className="text-white-75 mb-4" style={{ lineHeight: '1.7' }}>
                  Simplify and streamline your workflows with a modern, intuitive admin panel. Built for productivity.
                </p>
                <div className="d-flex gap-3" style={{ flexWrap: 'wrap' }}>
                  {[FaLinkedin, FaTwitter, FaGithub].map((Icon, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '0.3s',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                    >
                      <Icon color="white" size={16} />
                    </div>
                  ))}
                </div>
              </Col>

              {/* Quick Links */}
              <Col md={2} className="mb-4" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <h6 className="fw-semibold mb-3">Quick Links</h6>
                <ul className="list-unstyled">
                  {['Dashboard', 'User Management', 'Analytics', 'Settings'].map((text, i) => (
                    <li className="mb-2" key={i}>
                      <a
                        href="#"
                        style={linkDefaultStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, linkDefaultStyle)}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </Col>

              {/* Support */}
              <Col md={3} className="mb-4" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <h6 className="fw-semibold mb-3">Support</h6>
                <ul className="list-unstyled">
                  {['Help Center', 'Documentation', 'Contact Support', 'Privacy Policy'].map((text, i) => (
                    <li className="mb-2" key={i}>
                      <a
                        href="#"
                        style={linkDefaultStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, linkHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, linkDefaultStyle)}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </Col>

              {/* Contact Info */}
              <Col md={3} className="mb-4" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <h6 className="fw-semibold mb-3">Contact Info</h6>
                <div className="mb-2 d-flex align-items-center" style={{ flexWrap: 'wrap' }}>
                  <FaMapMarkerAlt className="me-2 text-white-50" size={14} style={{ flexShrink: 0 }} />
                  <small style={{ wordBreak: 'break-word' }}>123 Business St, Tech City</small>
                </div>
                <div className="mb-2 d-flex align-items-center" style={{ flexWrap: 'wrap' }}>
                  <FaPhone className="me-2 text-white-50" size={14} style={{ flexShrink: 0 }} />
                  <small style={{ wordBreak: 'break-word' }}>+1 (555) 123-4567</small>
                </div>
                <div className="mb-3 d-flex align-items-center" style={{ flexWrap: 'wrap' }}>
                  <FaEnvelope className="me-2 text-white-50" size={14} style={{ flexShrink: 0 }} />
                  <small style={{ wordBreak: 'break-word' }}>support@dashboard.com</small>
                </div>
                <div
                  className="p-3 rounded-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    fontSize: '0.85rem',
                    wordBreak: 'break-word'
                  }}
                >
                  <strong>Business Hours:</strong><br />
                  Mon-Fri: 10:00 AM - 7:00 PM<br />
                  Sat: 10:00 AM - 6:00 PM
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Bottom Section */}
      <div
        className="py-3"
        style={{
          background: 'rgba(0,0,0,0.15)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        <Container fluid style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          <Row className="justify-content-center" style={{ margin: '0', padding: '0 15px' }}>
            <Col lg={10} style={{ maxWidth: '100%' }}>
              <Row className="align-items-center" style={{ margin: '0' }}>
                <Col md={6} style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <small className="text-white-75">© 2025 Admin Dashboard. All rights reserved.</small>
                </Col>
                <Col md={6} className="text-md-end mt-2 mt-md-0" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <small className="text-white-75 d-flex align-items-center justify-content-md-end justify-content-start" style={{ flexWrap: 'wrap' }}>
                    Made with <FaHeart className="text-danger mx-1" size={12} style={{ flexShrink: 0 }} /> by Your Team
                  </small>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;