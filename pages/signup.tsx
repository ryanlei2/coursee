import router from 'next/router'
import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { FirebaseError } from 'firebase/app'

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
    <div
      style={{
        width: '40%',
        margin: 'auto',
        fontSize: '2vmax',
        marginTop: '150px',
        marginBottom: '400px'
      }}
    >
      <h1 className="text-center my-3 display-3">Signup</h1>
      
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
          variant="primary" 
          type="submit"
          style={{ height: '40px', fontSize:'20px', marginTop:'30px' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Signup'}
        </Button>
      </Form>
      
      <div className="text-center mt-3">
        Already have an account?{' '}
        <a href="/login" style={{ textDecoration: 'none' }}>
          Login here
        </a>
      </div>
    </div>
  )
}

export default Signup
