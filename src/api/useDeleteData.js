import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthData } from '../redux/slices/authDataSlice';
import { DeleteService } from './services/requests-service';


const useDeleteData = () => {
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState(null);
    const [errors, setErrors] = useState(null);
    const token = localStorage.getItem("token") || "";
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
        console.log({ route, data, token, });
        try {
            setLoading(true);
            const res = await DeleteService({ route, data, params });
            setErrors(null);
            setResData(res.data);
            setLoading(false);
            console.log(res);
            return res;

        } catch (error) {
            console.log({ error });
            setErrors(error);
            setLoading(false);

            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                handleLogout(error);
            } else {
                setErrors({ error: error?.response?.data?.error });
            }
            return { error: error.response.data.error };
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