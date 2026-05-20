const API_URL = 'http://localhost:8089/auth';

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Identifiants incorrects');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  localStorage.setItem('role', data.role);
  return data;
};

export const register = async (username, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Nom d\'utilisateur déjà pris');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  localStorage.setItem('role', data.role);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
};

export const getToken = () => localStorage.getItem('token');
export const getUsername = () => localStorage.getItem('username');
export const getRole = () => localStorage.getItem('role');
export const isAdmin = () => localStorage.getItem('role') === 'ROLE_ADMIN';
export const isAuthenticated = () => !!localStorage.getItem('token');

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});
