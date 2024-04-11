import { toast } from 'react-toastify';

export const ErrorHandler = (error) => {
  if (error.response) toast.error(error.response.message);
  else toast.error(error.message);
};
