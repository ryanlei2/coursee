import React, { useEffect, useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import Image from 'next/image';
import favicon from '../assets/favicon.ico'
import styles from '../styles/navbar.module.css'

import { checkAdmin } from '../config/firebase'


const NavbarComp = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const isHomePage = router.pathname === '/'

  
  useEffect(() => {
    async function fetchAdminStatus() {
      if (!user?.uid) return;
      const isAdmin = await checkAdmin(user.uid);
      setIsAdmin(isAdmin);
    }
  
    if (user && user.uid) {
      fetchAdminStatus();
    }
  }, [user]);

  return (
      <Navbar expand="xl" className={styles.navBar}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: (user && !isHomePage) ? '#ffffff' : '#EFF3FE',
          backgroundImage: (user && !isHomePage) ? 'none' : 'linear-gradient(rgba(102, 126, 234, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 126, 234, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
          zIndex: -1
        }}></div>
        <div style={{ maxWidth: '1400px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 3rem' }}>
          <div className={styles.brandContainer}>
            <Link href="/"  passHref legacyBehavior>
              <Nav.Link className={styles.brandIconHover}>
                <Image 
                style={{
                  marginRight: '10px',
                }}
                  width="30" height="30"
                  src={favicon}
                  alt='logo'
                />
              </Nav.Link>
            </Link>
            
            <Link href="/" passHref legacyBehavior>
              <Navbar.Brand className={styles.brandText}>
                Coursee
              </Navbar.Brand>
            </Link>
          </div>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={`me-3 ${styles.navToggle}`} />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
            
            {/* Home/About - only visible when not logged in */}
            {!user && (
              <>
                <Nav.Item>
                  <Link href='/' passHref legacyBehavior>
                    <Nav.Link className={styles.navLink}>
                      Home
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Link href='/about' passHref legacyBehavior>
                    <Nav.Link className={styles.navLink}>
                      About
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              </>
            )}
            
            {/* Dashboard - only for logged in users */}
            {user && (
              <Nav.Item>
                <Link href='/dashboard' passHref legacyBehavior>
                  <Nav.Link className={styles.navLink}>
                    Dashboard
                  </Nav.Link>
                </Link>
              </Nav.Item>
            )}
            
            {/* Login/Logout */}
            {user ? (
              <Nav.Item className="ms-3">
                <Nav.Link
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                  className={styles.navButton}
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Item className="ms-3">
                <Link href='/login' passHref legacyBehavior>
                  <Nav.Link className={styles.navButton}>
                    Login
                  </Nav.Link>
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
        </div>
    </Navbar>
  );
}

export default NavbarComp
