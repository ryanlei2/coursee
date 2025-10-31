import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { FirebaseError } from 'firebase/app'


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
    <div
      style={{
        width: '40%',
        margin: 'auto',
        fontSize: '2vmax',
        marginTop: '150px',
        marginBottom: '250px'
      }}
    >
      <h1 className="text-center my-3 display-3 ">Login</h1>
      
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
          variant="primary" 
          type="submit"
          style={{ height: '40px', fontSize:'20px', marginTop:'30px', marginBottom:'15px' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
      <hr></hr>
      <p>New to Coursee? <Link href='/signup'>Sign Up</Link></p>
      <Button href='PasswordResetForm'
      style={{ height: '40px', fontSize:'20px'}}
      >Forgot Password?</Button>

    </div>
  )
}

export default Login
