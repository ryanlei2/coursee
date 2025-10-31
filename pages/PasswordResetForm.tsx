import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { auth, sendPasswordResetEmail } from '../config/firebase';

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
        <Container className='display-3'
        style={{
            marginTop:'120px', 
            width:'700px',
            display:'flex',
            flexDirection:'column',
            alignContent:'space-between',

        }}>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    pattern="^\S+@\S+\.\S+$"
                    required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={handleSendPasswordResetEmail}>
                    Send Password Reset Email
                </Button>
            </Form>
        </Container>
    
    );
};

export default PasswordResetForm;
