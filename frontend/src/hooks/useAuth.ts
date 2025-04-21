import { useGetMeQuery } from '@/store/api/auth.api';
import { setUser } from '@/store/slices/auth.slice';
import { useDispatch } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: false,
  });

  dispatch(setUser(data ?? null));

  return { user: data, isLoading, isError };
};
