import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  style: {
    borderRadius: '16px',
    fontFamily: "'Public Sans', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
  }
};

export const notify = {
  success: (msg: string) => toast.success(msg, defaultOptions),
  error: (msg: string) => toast.error(msg, defaultOptions),
  info: (msg: string) => toast.info(msg, defaultOptions),
  warning: (msg: string) => toast.warn(msg, defaultOptions),
};