import { toast } from 'react-toastify';

export const errorHandler = (error) => {
  if (error.response) toast.error(error.response.message);
  else toast.error(error.message);
};
