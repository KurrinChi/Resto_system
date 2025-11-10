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
};

const UsersKey = 'rs_users_v1';

export const Login: React.FC = () => {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const raw = localStorage.getItem(UsersKey);
    const users: User[] = raw ? JSON.parse(raw) : [];
    const found = users.find((u) => u.username === user || u.email === user);
    if (!found) return setError('User not found');
    if (found.password !== password) return setError('Incorrect password');
    localStorage.setItem('rs_current_user', JSON.stringify(found));
    navigate('/client');
  };

  return (
    <div className="max-w-md mx-auto">
  <Card title="Sign in" padding="lg" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Username or Email</label>
            <input value={user} onChange={(e) => setUser(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>

          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex items-center justify-between">
            <Button type="submit">Sign in</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/client/register')}>Create account</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
