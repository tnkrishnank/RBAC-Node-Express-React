import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAdminAuth from '../components/AdminAuth';

function ViewBlogPage() {
    useAdminAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPost(res.data);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/admin');
                } else {
                    setError('Failed to fetch post. Please try again later.');
                }
            }
        };

        fetchPost();
    }, [navigate, id]);

    return (
        <div style={styles.container}>
            {error && <p style={styles.error}>{error}</p>}
            {!post && !error && <p>Loading...</p>}

            {post && (
                <div style={styles.card}>
                    <h2>{post.title}</h2>
                    <p style={styles.content}>{post.content}</p>
                    <button style={styles.backButton} onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        backgroundColor: '#f5f6fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
    },
    content: {
        marginTop: '20px',
        color: '#636e72',
        whiteSpace: 'pre-line',
    },
    backButton: {
        marginTop: '30px',
        padding: '10px 20px',
        backgroundColor: '#0984e3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
    },
    error: {
        color: 'red',
    }
};

export default ViewBlogPage;