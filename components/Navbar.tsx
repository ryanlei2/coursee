import React, { useEffect, useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import Image from 'next/image';
import favicon from '../assets/favicon.ico'
import styles from '../styles/navbar.module.css'

import { checkAdmin } from '../config/firebase'
import AdminDashboard from "../components/AdminDashboard"
import StudentDashboard from '../components/StudentDashboard'


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
      <Navbar expand="xl" sticky='top' className={styles.navBar}
      style={{
        height:'130px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}
      >
        <Link href="/"  passHref legacyBehavior>
          <Nav.Link className={styles.brandIconHover}>
            <Image 
            className='shadow-lg'
            style={{
              marginLeft: '30px',
              marginRight: '30px',
            }}
              width="80" height="80"
              src={favicon}
              alt='logo'
            />
          </Nav.Link>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
          <Nav
          >
            {user ? (
              <div style={{
                display: 'flex',
              }}>
              <Nav.Item className="ms-auto display-2" style={{marginRight: '20px'}}>
                <Nav.Link className='' 
                  onClick={() => {
                    router.push('/dashboard')
                  }}
                >
                  dashboard
                </Nav.Link>
              </Nav.Item>
              </div>
              
            ) : (
              <>
              </>
            )}
            
            {/* {!isAdmin && user ? (
              <div style={{
                display: 'flex',
              }}>
              <Nav.Item className="ms-auto display-2" style={{marginRight: '20px'}}>
                <Nav.Link className='' 
                  onClick={() => {
                    router.push('/resultsPage')
                  }}
                >
                  results
                </Nav.Link>
              </Nav.Item>
              </div>
              
            ) : (
              <>
              </>
            )} */}
          </Nav>
        <Nav className='container-fluid'>
            {user ? (
              <>
              </>//if not logged in show btn
            ) : (
              <>
                <Nav.Item className='display-2 ms-auto'>
                  <Nav.Link href='/about' className='' aria-current="page">
                    about
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
        </Nav>
        <Nav className='container-fluid'>
            {user ? (
              <>
              </>//if not logged in show btn
            ) : (
              <>
                <Nav.Item className='display-2 ms-auto'>
                  <Nav.Link href='/faq' className='' aria-current="page"
                  >
                    FAQ
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
        </Nav>
        <Nav className='container-fluid'>
          {user ? (
            <Nav.Item className="ms-auto display-2">
              <Nav.Link className=''
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
              >
                logout
              </Nav.Link>
            </Nav.Item>
          ) : (
            <>
              <Nav.Item className='ms-auto display-2'>
                <Nav.Link href='/login' className='' aria-current="page">
                  login
                </Nav.Link>
              </Nav.Item>
            </>
          )}
        </Nav> 
          </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComp
