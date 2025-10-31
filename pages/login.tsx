import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { FirebaseError } from 'firebase/app'
import Image from 'next/image'
import favicon from '../assets/favicon.ico'


const Login = () => {
  const router = useRouter()
  const { user, login } = useAuth()
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(data.email, data.password)
      router.push('/dashboard')
    } catch (err) {
      const error = err as FirebaseError
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.')
          break
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.')
          break
        case 'auth/invalid-email':
          setError('Invalid email address.')
          break
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.')
          break
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later.')
          break
        default:
          setError(`Failed to login: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        body { overflow: hidden; }
      `}</style>
      <div style={{ height: '100vh', width: '100vw', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', flexDirection: 'column', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
        <Link href='/' style={{ position: 'absolute', top: '2rem', left: '2rem', color: '#667eea', textDecoration: 'none', fontSize: '16px' }}>← Back to Home</Link>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Image src={favicon} alt='Coursee logo' width={40} height={40} style={{ marginRight: '12px' }} />
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000000', margin: 0 }}>Coursee</h2>
      </div>
      <div style={{ maxWidth: '500px', width: '100%', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold', color: '#000000' }}>Sign in to your account</h1>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
          style={{ height: '50px', fontSize:'20px' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
            required
            disabled={loading}
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
          style={{ height: '50px', fontSize:'20px' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
            required
            disabled={loading}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button 
          type="submit"
          style={{ 
            width: '100%',
            height: '50px', 
            fontSize: '18px', 
            marginTop: '20px', 
            marginBottom: '20px',
            backgroundColor: '#667eea',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
      
      <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
        <p style={{ marginBottom: '10px', color: '#666' }}>New to Coursee? <Link href='/signup' style={{ color: '#667eea', textDecoration: 'none' }}>Sign Up</Link></p>
        <Button 
          href='PasswordResetForm'
          variant="outline-secondary"
          style={{ height: '40px', fontSize: '16px', borderRadius: '8px' }}
        >
          Forgot Password?
        </Button>
      </div>
        </div>
      </div>
    </>
  )
}

export default Login