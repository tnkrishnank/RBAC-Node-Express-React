import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAdminAuth from '../components/AdminAuth';

function CreateBlogPage() {
    useAdminAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/posts/create', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/admin/login');
            } else {
                setError('Failed to create post. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        navigate('/admin/dashboard');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Create New Blog</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        style={{ ...styles.input, height: '150px', resize: 'vertical' }}
                        name="content"
                        placeholder="Content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <div style={styles.buttonGroup}>
                        <button type="submit" style={styles.button}>Create</button>
                        <button type="button" style={{ ...styles.button, backgroundColor: '#d63031' }} onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
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
        width: '400px',
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
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#0984e3',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        flex: 1,
        marginRight: '10px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default CreateBlogPage;