import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { auth, sendPasswordResetEmail } from '../config/firebase';
import Image from 'next/image';
import favicon from '../assets/favicon.ico';
import Link from 'next/link';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent successfully. Check your inbox.');
            setError('');
            setEmail('');
        } catch (err) {
            setError('Failed to send password reset email. Please try again.');
            setMessage('');
        }
    }

    const handleSendPasswordResetEmail = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            setError('Invalid email format.');
            setMessage('');
            return;
        }
        handlePasswordReset(email);
    }

    return (
        <>
            <style jsx global>{`
                body { overflow: hidden; }
            `}</style>
            <div style={{ height: '100vh', width: '100vw', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', flexDirection: 'column', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <Image src={favicon} alt='Coursee logo' width={40} height={40} style={{ marginRight: '12px' }} />
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000000', margin: 0 }}>Coursee</h2>
                </div>
                <div style={{ maxWidth: '500px', width: '100%', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold', color: '#000000' }}>Reset your password</h1>
                    
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                style={{ height: '50px', fontSize:'20px' }}
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                pattern="^\S+@\S+\.\S+$"
                                required
                            />
                        </Form.Group>

                        <Button 
                            type="submit" 
                            onClick={handleSendPasswordResetEmail}
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
                        >
                            Send Password Reset Email
                        </Button>
                    </Form>
                    
                    <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                        <p style={{ color: '#666' }}>Remember your password? <Link href='/login' style={{ color: '#667eea', textDecoration: 'none' }}>Sign in</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordResetForm;
