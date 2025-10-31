import type { NextPage } from 'next'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'


const Home: NextPage = () => {
  const { user } = useAuth()

  try {
    // Your code to display the image
  } catch (error) {
    console.error(error);
  }
  return (
    <div className='text-center'>
      <div style={{ 
        backgroundColor: '#EFF3FE',
        backgroundImage: 'linear-gradient(rgba(102, 126, 234, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 126, 234, 0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        height: '150px', 
        width: '100vw', 
        position: 'relative', 
        left: '50%', 
        right: '50%', 
        marginLeft: '-50vw', 
        marginRight: '-50vw',
        marginTop: '-80px',
        paddingTop: '80px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
      }}></div>
      <div style={{ 
        backgroundColor: '#EFF3FE',
        backgroundImage: 'linear-gradient(rgba(102, 126, 234, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 126, 234, 0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 -150px',
        marginBottom: '200px', 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)'
      }}>
        <div style={{ textAlign: 'left', padding: '0 0 100px 0', maxWidth: '1400px', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '2rem', color: '#000000', paddingLeft: '2rem' }}>
            Let&apos;s Plan Together
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '3rem', color: '#000000', maxWidth: '600px', paddingLeft: '2rem' }}>
            We&apos;re on a mission to help every student choose the right path.
          </p>
          <div style={{ paddingLeft: '2rem' }}>
            <Link href={user ? "/survey" : "/signup"} legacyBehavior>
              <a style={{ 
                fontSize: '1.2rem', 
                padding: '15px 30px', 
                backgroundColor: '#667eea', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}>
                Get Started
              </a>
            </Link>
          </div>
        </div>
      </div>
      
      <div style={{ maxWidth: '1400px', margin: '-150px auto 20px auto', padding: '0 1rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', color: '#000000', marginBottom: '4rem' }}>Key Features</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>Smart Course Matching</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>Personalized Recommendations</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>Academic Planning</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
        </div>
      </div>
    </div>
      
  );
}

export default Home
