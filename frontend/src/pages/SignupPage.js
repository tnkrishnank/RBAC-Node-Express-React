import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        navigate('/blogs');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
        await axios.post('http://localhost:5000/api/authentication/register', formData);
        setMessage('Verification email sent. Please check your inbox.');
        setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div style={styles.container}>
        <div style={styles.card}>
            <h2 style={styles.heading}>Sign Up</h2>
            {error && <p style={styles.error}>{error}</p>}
            {message && <p style={styles.success}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
            <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                style={styles.input}
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit" style={styles.button}>Sign Up</button>
            </form>
            <p style={{ marginTop: '15px' }}>
            Already have an account?{' '}
            <button style={styles.linkButton} onClick={() => navigate('/login')}>
                Login
            </button>
            </p>
        </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f6fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        width: '350px',
    },
    heading: {
        marginBottom: '20px',
        color: '#2f3640',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #dcdde1',
    },
    button: {
        backgroundColor: '#0984e3',
        color: '#fff',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    success: {
        color: 'green',
        marginBottom: '10px',
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#0984e3',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '15px',
    },
};

export default SignupPage;