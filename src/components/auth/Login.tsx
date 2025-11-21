import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_THEME as THEME } from '../../constants/clientTheme';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!user.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data.success) {
        // Route based on role
        if (data.role === 'Admin') {
          navigate('/admin');
        } else if (data.role === 'Customer') {
          navigate('/client');
        } else {
          setError('Invalid user role');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'auto' }}>
      <div className="min-h-screen flex">
        {/* Left Side */}
        <div 
          className="hidden lg:flex w-1/2 relative"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=1200&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${THEME.colors.primary.DEFAULT}dd, ${THEME.colors.primary.dark}dd)`
            }}
          />
          <div className="relative z-10 w-full flex flex-col justify-center items-center text-center px-12 text-white">
            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-24 w-auto mb-4"
            />
            <h1 className="text-3xl font-bold mb-3">Sili & Sarsa</h1>
            <p className="text-base opacity-90">Sign in to continue your culinary journey</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div 
          className="flex-1 flex items-center justify-center px-8 py-12"
          style={{ backgroundColor: '#FFFFFF' }}
        >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: THEME.colors.text.primary }}>
              Sign In
            </h2>
            <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
                Email
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: THEME.colors.text.tertiary }} 
                />
                <input 
                  type="email"
                  value={user} 
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                    color: THEME.colors.text.primary,
                    '--tw-ring-color': THEME.colors.primary.DEFAULT
                  } as React.CSSProperties}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: THEME.colors.text.tertiary }} 
                />
                <input 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                    color: THEME.colors.text.primary,
                    '--tw-ring-color': THEME.colors.primary.DEFAULT
                  } as React.CSSProperties}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
              >
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: THEME.colors.primary.DEFAULT,
                color: '#FFFFFF'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            {/* Divider */}
            <div className="relative">
              <div 
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t" style={{ borderColor: THEME.colors.border.DEFAULT }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-2" 
                  style={{ 
                    backgroundColor: THEME.colors.background.primary,
                    color: THEME.colors.text.tertiary 
                  }}
                >
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full py-3 rounded-lg font-semibold border-2 transition-all hover:border-opacity-80"
              style={{
                borderColor: THEME.colors.primary.DEFAULT,
                color: THEME.colors.primary.DEFAULT,
                backgroundColor: 'transparent'
              }}
            >
              Create an Account
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
