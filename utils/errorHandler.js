import { toast } from 'react-toastify';

const ErrorHandler = (error, message) => {
  if (!error) {
    toast.error(message || 'Oops, something went wrong');
    return;
  }

  if (!error.response?.data) {
    toast.error(error.message || 'Oops, something went wrong');
    return;
  } else {
    const { message } = error.response.data;
    if (typeof message === 'string') {
      toast.error(message);
    } else if (Array.isArray(message)) {
      toast.error(message[0]);
    } else {
      toast.error('An unexpected error occurred.');
    }
    return;
  }
};

export default ErrorHandler;
