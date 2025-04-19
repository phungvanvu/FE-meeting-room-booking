import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
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
    <div className='min-h-screen flex'>
      {/* Left panel: illustration chiếm 3/4 */}
      <div className='hidden lg:flex w-3/4 relative overflow-hidden bg-gradient-to-tr from-blue-100 to-blue-200'>
        {/* Shape decor */}
        <div className='absolute -top-16 -left-16 w-72 h-72 bg-white opacity-20 rounded-full'></div>
        <div className='absolute -bottom-16 -right-16 w-96 h-96 bg-white opacity-10 rounded-full'></div>

        <img
          src='/picture1.png'
          alt='Illustration'
          className='m-auto object-cover w-full h-full'
        />
      </div>

      {/* Right panel: form chiếm 1/4 */}
      <div className='flex w-full lg:w-1/4 items-center justify-center bg-white'>
        <div className='relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm'>
          {/* Light shape behind card */}
          <div className='absolute -top-6 -right-6 w-20 h-20 bg-blue-100 rounded-full opacity-50'></div>

          <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>
            Welcome Back
          </h2>

          {error && (
            <div className='text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center'>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className='space-y-5'>
            {/* Username field */}
            <div className='relative'>
              <User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
              />
            </div>

            {/* Password field */}
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
              />
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-xl transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Forgot link */}
          <p className='mt-4 text-center text-sm text-gray-500'>
            <button
              onClick={() => navigate('/forgot-password')}
              className='underline hover:text-gray-700'
            >
              Forgot password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
