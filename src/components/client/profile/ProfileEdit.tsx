import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';

export const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const rawUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('rs_current_user') || 'null'); } catch { return null; }
  }, []);

  const [name, setName] = React.useState(rawUser?.name ?? '');
  const [email, setEmail] = React.useState(rawUser?.email ?? '');
  const [avatar, setAvatar] = React.useState(rawUser?.avatar ?? '');
  const [oldPass, setOldPass] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSave = () => {
    try {
      const usersRaw = localStorage.getItem('rs_users_v1');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const idx = users.findIndex((u: any) => u.id === rawUser.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name, email, avatar };
        localStorage.setItem('rs_users_v1', JSON.stringify(users));
      }
      const updated = { ...rawUser, name, email, avatar };
      localStorage.setItem('rs_current_user', JSON.stringify(updated));
      setMessage('Saved');
    } catch {
      setMessage('Failed to save');
    }
  };

  const handlePassword = () => {
    if (!oldPass || !newPass) return setMessage('Please fill both password fields');
    const usersRaw = localStorage.getItem('rs_users_v1');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const idx = users.findIndex((u: any) => u.id === rawUser.id);
    if (idx === -1) return setMessage('User not found');
    if (users[idx].password !== oldPass) return setMessage('Old password incorrect');
    users[idx].password = newPass;
    localStorage.setItem('rs_users_v1', JSON.stringify(users));
    setMessage('Password updated');
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (!confirm('Delete account permanently?')) return;
    try {
      const usersRaw = localStorage.getItem('rs_users_v1');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const filtered = users.filter((u: any) => u.id !== rawUser.id);
      localStorage.setItem('rs_users_v1', JSON.stringify(filtered));
      localStorage.removeItem('rs_current_user');
      navigate('/client');
    } catch {
      setMessage('Failed to delete');
    }
  };

  if (!rawUser) return <div style={{ color: THEME.colors.text.tertiary }}>Not signed in.</div>;

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-2xl font-semibold" style={{ color: THEME.colors.text.primary }}>Edit Profile</h2>

      <div className="rounded-lg p-4" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>
          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>

          <div>
            <label className="block text-sm" style={{ color: THEME.colors.text.tertiary }}>Avatar</label>
            <div className="flex items-center gap-2 mt-2">
              <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0])} />
              {avatar && <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full" />}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium" style={{ color: THEME.colors.text.primary }}>Change Password</div>
            <input type="password" placeholder="Old password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
            <input type="password" placeholder="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
            <div className="mt-2 flex gap-2">
              <Button onClick={handlePassword}>Update password</Button>
            </div>
          </div>

          {message && <div className="text-sm text-green-400">{message}</div>}

          <div className="flex gap-2 mt-3">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="danger" onClick={handleDelete}>Delete account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
