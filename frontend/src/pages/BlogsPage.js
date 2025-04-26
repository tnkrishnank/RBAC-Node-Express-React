import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BlogsPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(res.data);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Failed to fetch posts. Please try again later.');
                }
            }
        };

        fetchPosts();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleView = (postId) => {
        navigate(`/blogs/${postId}`);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Blogs</h2>
                <div>
                    <button style={{ ...styles.button, backgroundColor: '#d63031' }} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            {posts.length === 0 && !error ? (
                <p style={styles.noPosts}>No posts available.</p>
            ) : (
                <div style={styles.postList}>
                    {posts.map((post) => (
                        <div key={post._id} style={styles.postCard}>
                            <h3>{post.title}</h3>
                            <p style={styles.content}>{post.content}</p>

                            <div style={styles.buttonContainer}>
                                <button style={{ ...styles.actionButton, backgroundColor: '#00b894' }} onClick={() => handleView(post._id)}>View</button>
                            </div>
                        </div>
                    ))}
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
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    button: {
        marginLeft: '10px',
        backgroundColor: '#0984e3',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '15px',
        cursor: 'pointer',
    },
    postList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    postCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '180px',
        overflow: 'hidden',
    },
    content: {
        color: '#636e72',
        marginBottom: '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordWrap: 'break-word',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    actionButton: {
        flex: 1,
        margin: '0 5px',
        padding: '8px 10px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#fff',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '20px',
    },
    noPosts: {
        textAlign: 'center',
        marginTop: '50px',
        fontSize: '18px',
        color: '#636e72',
    }
};

export default BlogsPage;