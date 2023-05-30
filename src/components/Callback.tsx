import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Callback = () => {
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');
    const tokenType = params.get('token_type');
    // Store the access token and other data in state or in a cookie
  }, [search]);

  return <div>Authenticating...</div>;
};

export default Callback;
