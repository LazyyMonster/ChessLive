import { useState, useEffect, useRef } from 'react';
import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { useNavigate } from 'react-router-dom';

const lichessHost = 'https://lichess.org';
const scopes = ["study:write", "study:read", "challenge:read", "bot:play", "board:play"];
const clientId = 'lichess-api-demo';
const redirectUrl = 'http://localhost:3000/playLichess';


const fetchLichessAccount = async (token) => {
  try {
    const response = await fetch(`${lichessHost}/api/account`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to fetch account info.');
    return await response.json();
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

const fetchResponse = async (token, path, options = {}) => {
  const config = {
    ...options,
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await fetch(`${lichessHost}${path}`, config);
  if (!res.ok) {
    const err = `${res.status} ${res.statusText}`;
    throw new Error(err);
  }
  return res;
};

const fetchBody = async (token, path, options = {}) => {
  const res = await fetchResponse(token, path, options);
  return res.json();
};


export default function LichessOAuth() {
  const [token, setToken] = useState(localStorage.getItem("lichessToken") || null);
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const isProcessingAuth = useRef(false);
  const navigate = useNavigate();

  const getOauth = () => {
    return new OAuth2AuthCodePKCE({
      authorizationUrl: `${lichessHost}/oauth`,
      tokenUrl: `${lichessHost}/api/token`,
      clientId,
      scopes,
      redirectUrl,
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: () => console.warn('Invalid grant'),
    });
  };

  const lichessLogin = () => {
    const oauth = getOauth();
    localStorage.removeItem('oauth2authcodepkce-state'); // Remove previous state
    oauth.fetchAuthorizationCode();
  };

  const lichessLogout = () => {
    setToken(null);
    setUsername('');
    setProfileUrl('');
    localStorage.removeItem('lichessToken');
    localStorage.removeItem('oauth2authcodepkce-state');
  };

  const checkAuthStatus = async () => {
    if (isProcessingAuth.current || localStorage.getItem('authInProgress')) return;
  
    try {
      isProcessingAuth.current = true;
      localStorage.setItem('authInProgress', 'true');
  
      const oauth = getOauth();
      const isReturning = await oauth.isReturningFromAuthServer();
  
      if (isReturning) {
        const accessContext = await oauth.getAccessToken();
        const newToken = accessContext?.token?.value;
  
        if (!newToken) throw new Error('Access token is missing or invalid.');
  
        setToken(newToken);
        localStorage.setItem('lichessToken', newToken);
        localStorage.removeItem('authInProgress');
      }
    } catch (err) {
      console.error('Authentication Error:', err.message);
    } finally {
      isProcessingAuth.current = false;
      localStorage.removeItem('authInProgress');
    }
  };
  
  useEffect(() => {
    if (!token) checkAuthStatus();
    else {
      fetchLichessAccount(token).then((account) => {
        if (account) {
          setUsername(account.username);
          setProfileUrl(account.url);
        }
      });
    }
  }, [token]);

  return { token, username, profileUrl, lichessLogin, lichessLogout };
}
