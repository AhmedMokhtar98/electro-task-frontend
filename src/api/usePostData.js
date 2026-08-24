import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../redux/slices/authDataSlice';
import { PostService } from './services/requests-service';
import { showToast } from '@/components/toastify/Toast';

const usePostData = () => {
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState(null);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ====handle Logout====
    const handleLogout = (error) => {
        localStorage.removeItem('token');
        dispatch(setAuthData({ authData: {}, auth: false, token: null }));
        navigate('/login');
        // Consistent error structure
        setErrors({ error: error });
    };

    const postData = async ({ route, data, params }) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await PostService({ route, data, params });
            console.log("res ====>", { route, data, res });
            setLoading(false);
            setResData(res);

            showToast({ text: res?.data?.result?.message || res?.data?.message, status:true});
            return res;
        } catch (error) {
            console.log("error ====>", error);
            setLoading(false);
            showToast({ text: error?.response?.data?.error || error?.response?.data?.message || error?.response?.message || error?.message, status: false });
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                handleLogout(error);
            } else {
                setErrors({ error: error });
            }
            return { error: error || 'An error occurred' };
        }
    };






    return {
        loading,
        res: resData,
        errors,
        postData,
        setRes: setResData,
    };
};

export default usePostData;