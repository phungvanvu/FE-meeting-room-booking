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
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Gán lỗi trả về từ API nếu có
        if (result.data && typeof result.data === 'object') {
          setValidationErrors(result.data);
        }

        const errorMessage =
          result.error && typeof result.error === 'object'
            ? result.error.message || 'Incorrect username or password.'
            : 'Incorrect username or password.';

        console.error('Login error:', errorMessage);
        return;
      }

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
      console.error('Unexpected error during login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12'>
      <img
        src='/1W8A8149.jpg'
        alt='Background'
        className='absolute inset-0 w-full h-full object-cover'
      />
      <div className='relative bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full max-w-4xl'>
        <div className='relative w-1/2 hidden md:block'>
          <div className='absolute -top-12 -left-12 w-32 h-32 bg-blue-200 opacity-20 rounded-full' />
          <div className='absolute -bottom-16 -right-10 w-48 h-48 bg-blue-100 opacity-10 rounded-full' />
          <div className='absolute inset-0 bg-gradient-to-tr from-blue-600 via-blue-400 to-transparent mix-blend-multiply' />
          <img
            src='/50683d57-14c7-4a71-9c53-52ed7f27560b.jpg'
            alt='Illustration'
            className='relative object-cover w-full h-full'
          />
        </div>

        <div className='relative w-full md:w-1/2 p-12 flex flex-col justify-center'>
          <h2 className='text-3xl font-medium tracking-normal text-gray-800 text-center mb-8'>
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className='space-y-6'>
            {/* Username */}
            <div className='flex flex-col gap-1'>
              <div className='relative'>
                <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Username'
                  className='w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
                />
              </div>
              <div className='min-h-[24px]'>
                {validationErrors.username && (
                  <p className='text-red-500 text-sm'>
                    {validationErrors.username[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1'>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  className='w-full pl-12 pr-12 py-4 border border-gray-300 rounded-2xl bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className='min-h-[24px]'>
                {validationErrors.password && (
                  <p className='text-red-500 text-sm'>
                    {validationErrors.password[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot password */}
            <div className='flex justify-end'>
              <button
                onClick={() => navigate('/forgot-password')}
                className='text-blue-600 hover:underline'
                type='button'
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-4 text-white font-semibold rounded-2xl transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
