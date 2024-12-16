import { useState, useEffect } from 'react';
import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { useNavigate } from 'react-router-dom';

const lichessHost = 'https://lichess.org';
const scopes = ["study:write", "study:read", "challenge:read", "bot:play", "board:play"];
const clientId = 'lichess-api-demo';
const clientUrl = 'http://localhost:3000/playLichess';

let isProcessingAuth = false;

const fetchLichessAccount = async (token) => {
  try {
    const response = await fetch(`${lichessHost}/api/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch account info.');
    return await response.json();
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

export default function LichessOAuth() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const navigate = useNavigate();

  const getOauth = () => {
    isProcessingAuth = true;
    return new OAuth2AuthCodePKCE({
      authorizationUrl: `${lichessHost}/oauth`,
      tokenUrl: `${lichessHost}/api/token`,
      clientId,
      scopes,
      redirectUrl: clientUrl,
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: () => console.warn('Invalid grant'),
    });
  };

  const lichessLogin = () => {
    const oauth = getOauth();
    localStorage.removeItem('oauth2authcodepkce-state');
    oauth.fetchAuthorizationCode();
  };

  const lichessLogout = () => {
    setToken(null);
    setUsername('');
    localStorage.removeItem('oauth2authcodepkce-state');
  };

  const checkAuthStatus = async () => {
    if (isProcessingAuth) {return}
    try {
      const oauth = getOauth();
      const isReturning = await oauth.isReturningFromAuthServer();

      if (!isReturning) return;

      const accessContext = await oauth.getAccessToken();
      const newToken = accessContext?.token?.value;

      if (!newToken) {
        console.error('Access token is missing or invalid.');
        return;
      }

      setToken(newToken);

      const account = await fetchLichessAccount(newToken);
      if (account) {
        setUsername(account.username);
        setProfileUrl(account.url);
        navigate('/playLichess');
      }
    } catch (err) {
      console.error('checkAuthStatus', err.message);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { token, username, profileUrl, lichessLogin, lichessLogout };
}
