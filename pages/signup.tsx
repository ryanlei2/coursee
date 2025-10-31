import router from 'next/router'
import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { FirebaseError } from 'firebase/app'
import Image from 'next/image'
import favicon from '../assets/favicon.ico'

const Signup = () => {
  const { user, signup } = useAuth()
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate password length
    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      await signup(data.email, data.password)
      router.push('/dashboard')
    } catch (err) {
      const error = err as FirebaseError
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in instead.')
          break
        case 'auth/invalid-email':
          setError('Invalid email address.')
          break
        case 'auth/weak-password':
          setError('Password is too weak. Use at least 6 characters.')
          break
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled. Please contact support.')
          break
        default:
          setError(`Failed to create account: ${error.message}`)
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
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold', color: '#000000' }}>Create your account</h1>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSignup}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
          style={{ height: '50px', fontSize:'20px' }}
            type="email"
            placeholder="Enter email"
            required
            disabled={loading}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
          style={{ height: '50px', fontSize:'20px' }}
            type="password"
            placeholder="Password (min. 6 characters)"
            required
            disabled={loading}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
          />
          <Form.Text className="text-muted">
            Password must be at least 6 characters long.
          </Form.Text>
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </Form>
      
      <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
        <p style={{ color: '#666' }}>Already have an account?{' '}
        <Link href="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
          Login here
        </Link></p>
      </div>
        </div>
      </div>
    </>
  )
}

export default Signup
