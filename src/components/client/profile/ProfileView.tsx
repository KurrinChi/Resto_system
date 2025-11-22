import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { getSessionUser, setSessionUser } from '../../../services/sessionService';
import { useNavigate } from 'react-router-dom';

export const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const user = React.useMemo(() => getSessionUser(), []);

  if (!user) return <div style={{ color: THEME.colors.text.tertiary }}>Not signed in.</div>;

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-2xl font-semibold" style={{ color: THEME.colors.text.primary }}>Profile</h2>

      <div className="rounded-lg p-4" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
        <div className="mb-3">
          <div className="text-lg font-medium" style={{ color: THEME.colors.text.primary }}>{user.fullName || 'Guest User'}</div>
          <div className="text-sm" style={{ color: THEME.colors.text.tertiary }}>{user.email}</div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigate('/client/profile/edit')}>Edit Profile</Button>
          <Button variant="danger" onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              try {
                setSessionUser(null as any);
              } catch {}
              window.location.href = '/login';
            }
          }}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
