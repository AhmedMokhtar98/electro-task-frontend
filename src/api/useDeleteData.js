import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthData } from '../redux/slices/authDataSlice';
import { DeleteService } from './services/requests-service';
import { showToast } from '@/components/toastify/Toast';


const useDeleteData = () => {
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState(null);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ====handle Logout=====
    const handleLogout = (error) => {
        localStorage.removeItem('token');
        dispatch(setAuthData({ authData: {}, auth: false, token: null }));
        navigate('/login');
        setErrors({ error: error?.response?.data?.error });
    };

    const deleteData = async ({ route, data, params }) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await DeleteService({ route, data, params });
            setResData(res.data);
            showToast({
                text: res?.data?.result?.message || res?.data?.message,
                status: true,
            });
            return res;

        } catch (error) {
            setErrors(error);

            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                handleLogout(error);
            } else {
                setErrors({ error });
            }
            showToast({
                text:
                    error?.response?.data?.error ||
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to delete task",
                status: false,
            });
            return { error };
        } finally {
            setLoading(false);
        }
    };

    return (
        {
            loading: loading,
            res: resData,
            errors: errors,
            deleteData
        }
    );
};


export default useDeleteData;
