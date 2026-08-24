import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../redux/slices/authDataSlice';
import { PutService } from './services/requests-service';

const usePutData = () => {
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState(null);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // ====handle Logout====
    const handleLogout = (error) => {
        localStorage.removeItem('token');
        dispatch(setAuthData({ authData: {}, auth: false, token:null }));
        navigate('/login');
        setErrors({ error: error?.response?.data?.error });
    };

    const putData = async ({ route, data, params }) => {
      
        // console_log('postdata' )
        try {
            setLoading(true);
         
            const res = await PutService({ route, data, params, onUploadProgress });
            console.log("res ====>", { route, data, res });
            setLoading(false);
            setErrors(null);
            setResData(res);
            return res;

        } catch (error) {
            //    handle error msg ()
            console.log({ error });
            setErrors(error);
            setLoading(false);

            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                handleLogout(error);
            } else {
                setErrors({ error: error?.response?.data?.error });
                // SweetAlert({ text: error?.response?.data?.error, status: error?.response?.data?.success })

            }
            return { error: error?.response?.data?.error };
        }
    };

    return (
        {
            loading,
            res: resData,
            errors,
            putData,
            setRes: setResData,
        }
    );
};


export default usePutData;