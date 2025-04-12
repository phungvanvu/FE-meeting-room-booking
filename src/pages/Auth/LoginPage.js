import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setRefreshToken } from '../../components/utils/auth';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../../config';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter complete information!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        const errorMessage =
          result.error && typeof result.error === 'object'
            ? result.error.message || 'Incorrect username or password.'
            : 'Incorrect username or password.';
        throw new Error(errorMessage);
      }
      const result = await response.json();
      if (result.success) {
        sessionStorage.setItem('accessToken', result.data.accessToken);
        setRefreshToken(result.data.refreshToken);
        const decoded = jwtDecode(result.data.accessToken);
        if (decoded.scope.includes('ROLE_USER')) {
          navigate('/BookRoom');
        } else if (decoded.scope.includes('ROLE_ADMIN')) {
          navigate('/ManageRoom');
        }
      }
    } catch (err) {
      setError(
        err.message || 'An error occurred while logging in. Please try again!',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 shadow-lg rounded-xl'>
        <h2 className='text-3xl font-bold text-center text-gray-700'>Login</h2>

        {error && (
          <p className='bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm mt-4 text-center'>
            {error}
          </p>
        )}

        <form className='mt-6' onSubmit={handleLogin}>
          <div className='mb-4'>
            <label className='block text-gray-600 font-medium'>Username</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter username'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'
            />
          </div>

          <div className='mb-4 relative'>
            <label className='block text-gray-600 font-medium'>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'
              autoComplete='off'
            />
            <button
              type='button'
              className='absolute right-3 top-9 text-gray-500 hover:text-gray-700'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold py-2 rounded-lg transition-all active:scale-95`}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <p className='mt-4 text-center text-gray-600'>
            <button
              onClick={() => navigate('/forgot-password')}
              className='text-blue-500 hover:underline'
            >
              Forgot password?
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
