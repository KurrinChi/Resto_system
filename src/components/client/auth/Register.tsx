import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';

type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  name?: string;
};

const UsersKey = 'rs_users_v1';

export const Register: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !email || !password) return setError('Please fill all fields');

    try {
      const raw = localStorage.getItem(UsersKey);
      const users: User[] = raw ? JSON.parse(raw) : [];
      if (users.find((u) => u.username === username)) return setError('Username already exists');
      if (users.find((u) => u.email === email)) return setError('Email already registered');

      const user: User = { id: Date.now().toString(), username, email, password };
      users.push(user);
      localStorage.setItem(UsersKey, JSON.stringify(users));
      // Simple auto-login by saving current user
      localStorage.setItem('rs_current_user', JSON.stringify(user));
      navigate('/client');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div className="max-w-md mx-auto">
  <Card title="Create account" padding="lg" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>

          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>

          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex items-center justify-between">
            <Button type="submit">Register</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/client/login')}>Already have an account?</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
