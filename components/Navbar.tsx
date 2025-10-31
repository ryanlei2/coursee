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
      <Navbar expand="xl" sticky='top' className={styles.navBar}>
        <Link href="/"  passHref legacyBehavior>
          <Nav.Link className={styles.brandIconHover}>
            <Image 
            className='shadow-sm'
            style={{
              marginLeft: '20px',
              marginRight: '15px',
            }}
              width="50" height="50"
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
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            {/* Home/About/FAQ - only visible when not logged in */}
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
                
                <Nav.Item>
                  <Link href='/faq' passHref legacyBehavior>
                    <Nav.Link className={styles.navLink}>
                      FAQ
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              </>
            )}
            
            <Nav.Item>
              <Link href='/catalog' passHref legacyBehavior>
                <Nav.Link className={styles.navLink}>
                  Catalog
                </Nav.Link>
              </Link>
            </Nav.Item>
            
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
    </Navbar>
  );
}

export default NavbarComp
