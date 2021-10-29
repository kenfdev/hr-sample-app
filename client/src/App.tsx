import React, { useState } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MembersPage from './pages/MembersPage';
import MemberDetailPage from './pages/MemberDetailPage';
import Navbar, { UserInfo } from './components/Navbar';
import { api } from './api/axios';

export default function App() {
  const location = useLocation();
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleLogin = async () => {
    const { data } = await api.get('/users/info');
    setUserInfo({
      username: data.username,
      userMenus: data.userMenu.map((um: any) => um.name),
    });
  };

  const handleLogout = () => {
    api.defaults.headers.common['x-user-id'] = '';
    history.push('/login');
  };

  return (
    <div className="container">
      {location.pathname === '/login' ? null : (
        <Navbar userInfo={userInfo!} onLogout={handleLogout} />
      )}
      <Switch>
        <Route path="/login">
          <LoginPage onLogin={handleLogin} />
        </Route>
        <Route path="/members" exact>
          <MembersPage />
        </Route>
        <Route path="/members/:memberId">
          <MemberDetailPage />
        </Route>
      </Switch>
    </div>
  );
}
