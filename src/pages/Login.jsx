import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (type = 'user') => {
    const demoAccounts = {
      user: { email: 'demo@example.com', password: 'password123' },
      premium: { email: 'premium@example.com', password: 'premium123' }
    };
    setFormData(demoAccounts[type]);
    setRememberMe(true);
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">

      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md anime">
          <div className="rounded-2xl shadow-xl p-8 bg-[var(--bg-color)] ">
            <div className="text-center mb-8">
              <div className="w-30 h-30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-4 border-[var(--accent-color)]">
                <img src="/log.png" alt="Logo" className="w-full h-full object-cover rounded-2xl "/>
              </div>
              <p style={{ color: 'var(--secondary-color)' }}>Sign in to your expense tracker account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 border rounded-lg text-[var(--error-color)]" >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--text-color)]">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors border-[var(--secondary-color)] text-[var(--text-color)]"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--text-color)]">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors pr-12 border-[var(--secondary-color)] text-[var(--text-color)]"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button" ù
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={loading}
                    style={{ color: 'var(--secondary-color)' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded focus:ring-2"
                    style={{ accentColor: 'var(--primary-color)' }}
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-[var(--text-color)]">Remember me</span>
                </label>

                <Link to="/forgot-password" className="text-sm text-[var(--primary-color)] ">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                className="w-full py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-opacity "
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--secondary-color)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm" style={{ color: 'var(--text-color)' }}>
                <span className="px-2" style={{ backgroundColor: 'var(--bg-color)' }}>Demo accounts</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-90 transition-colors hover:bg-[var(--primary-color)] border-[var(--secondary-color)]"
                
              >
                Demo User
              </button>
              <button
                onClick={() => handleDemoLogin('premium')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-90 transition-opacity hover:bg-[var(--primary-color)] border-[var(--secondary-color)]"
                
              >
                Demo Premium
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className='text-xs' style={{ color: 'var(--text-color)' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
                  Signup
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--secondary-color)', fontSize: '500' }}>
              © 2025 Planifieo. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Welcome Message */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-bl from-[var(--primary-color)] to-[var(--secondary-color)] items-center justify-center p-12 relative overflow-hidden ">
        <div className="relative z-10 text-white text-center max-w-lg anime">
          <h1 className="text-5xl font-bold mb-6 ">Welcome to Planifieo</h1>
          <p className="text-xl mb-8 opacity-90">
            Take control of your finances. Track your expenses, create budgets, and achieve your financial goals with our all-in-one tool.
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span>Real-time tracking of your expenses</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a2 2 0 11-4 0 2 2 0 014 0zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <span>Custom budgets by category</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span>Detailed reports and visualizations</span>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/70 float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/70 float"></div>

          {/* Animated floating elements */}
          <div className="absolute top-1/4 left-1/4 animate-float">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/30">
              <path d="M12 1V23M1 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="absolute top-1/4 right-1/4 animate-float" style={{ animationDelay: '1s' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-white/30">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" className="text-white/30">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;

