import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAdminAuth = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                await axios.post('http://localhost:5000/api/authentication/verify-admin', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error(error);
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                    } else if (error.response.status === 403) {
                        navigate('/blogs');
                    } else {
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            }
        };
        verifyAdmin();
    }, [navigate]);
};

export default useAdminAuth;