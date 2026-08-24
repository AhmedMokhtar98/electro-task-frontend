// src/components/Toast/Toast.js
import { toast } from 'react-toastify';
import { asyncOperation } from '../../utils/helpers';
import './style.css'
export const showToast = ({ text, status, time = 3000 }) => {
  const options = {
    position:'top-right',
    autoClose: time || 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  if (status) {
    toast.success(text, options);
  } else {
    toast.error(text, options);
  }
};



// Show toast for promise-based loading
export const showPromiseToast = (loading, { loadingText, successText, errorText, status }, time) => {
  toast.promise(
    asyncOperation(loading, status),
    {
      pending: loadingText || 'Loading...',
      success: successText || 'Success!',
      error: errorText || 'Error!',
    },
    {
      position: 'top-right',
      autoClose: time || 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    }
  );
};