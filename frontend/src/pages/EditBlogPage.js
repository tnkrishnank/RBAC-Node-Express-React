import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAdminAuth from '../components/AdminAuth';

function EditBlogPage() {
    useAdminAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTitle(res.data.title);
                setContent(res.data.content);
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

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/posts/${id}`, { title, content }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/admin');
            } else {
                setError('Failed to update post. Please try again.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2>Edit Post</h2>

                {error && <p style={styles.error}>{error}</p>}

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    style={styles.input}
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    style={{ ...styles.input, height: '150px' }}
                />

                <div style={styles.buttonGroup}>
                    <button style={styles.saveButton} onClick={handleUpdate}>Save</button>
                    <button style={styles.cancelButton} onClick={() => navigate('/admin/dashboard')}>Cancel</button>
                </div>
            </div>
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
    formCard: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: '20px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#00b894',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        flex: 1,
        marginRight: '10px',
    },
    cancelButton: {
        backgroundColor: '#d63031',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        flex: 1,
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    }
};

export default EditBlogPage;