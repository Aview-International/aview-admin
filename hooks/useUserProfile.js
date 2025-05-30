import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ErrorHandler from '../utils/errorHandler';
import { setAllLanguages } from '../store/reducers/aview.reducer';
import { getSupportedLanguages } from '../services/api';

const useUserProfile = () => {
  const isLoggedIn = useSelector((el) => el.user?.isLoggedIn);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const getLang = async () => {
    const res = await getSupportedLanguages();
    dispatch(setAllLanguages(res));
  };

  useEffect(() => {
    (async () => {
      try {
        getLang();
      } catch (error) {
        ErrorHandler(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isLoggedIn]);

  return { isLoading };
};

export default useUserProfile;
