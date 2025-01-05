import { useState, useEffect, useRef } from 'react';
import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { showSnackbar } from '../components/alerts/customSnackbar';
import { LICHESS_BASE_ENDPOINT, REDIRECT_URL } from '../components/settings/constants';

const scopes = ["study:write", "study:read", "challenge:read", "bot:play", "board:play"];
const clientId = 'lichess-api-demo';

const fetchLichessAccount = async (token) => {
  try {
    const response = await fetch(`${LICHESS_BASE_ENDPOINT}/api/account`, {
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
  const res = await fetch(`${LICHESS_BASE_ENDPOINT}${path}`, config);
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
  const [isAuthorized, setIsAuthorized] = useState(sessionStorage.getItem('isAuthorized') || false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const isProcessingAuth = useRef(false);

  const getOauth = () => {
    return new OAuth2AuthCodePKCE({
      authorizationUrl: `${LICHESS_BASE_ENDPOINT}/oauth`,
      tokenUrl: `${LICHESS_BASE_ENDPOINT}/api/token`,
      clientId,
      scopes,
      redirectUrl: REDIRECT_URL,
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: () => console.warn('Invalid grant'),
    });
  };

  const lichessLogin = () => {
    const oauth = getOauth();
    sessionStorage.removeItem('oauth2authcodepkce-state');
    oauth.fetchAuthorizationCode();
  };

  const lichessLogout = () => {
    setUsername('');
    setProfileUrl('');
    sessionStorage.removeItem('lichessToken');
    sessionStorage.removeItem('isAuthorized');
    sessionStorage.removeItem('oauth2authcodepkce-state');
    setIsAuthorized(false);
    showSnackbar("Succesfully logout!", "success");
  };

  const checkAuthStatus = async () => {
    if (isProcessingAuth.current) return;

    try {
      isProcessingAuth.current = true;

      const oauth = getOauth();
      const isReturning = await oauth.isReturningFromAuthServer();

      if (isReturning) {
        const accessContext = await oauth.getAccessToken();
        const newToken = accessContext?.token?.value;

        if (!newToken) throw new Error('Access token is missing or invalid.');

        setIsAuthorized(true);
        sessionStorage.setItem('lichessToken', newToken);
        sessionStorage.setItem('isAuthorized', true);

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState(null, '', cleanUrl);
      }
    } catch (err) {
      console.error('Authentication Error:', err.message);
    } finally {
      setIsAuthChecked(true);
      isProcessingAuth.current = false;
    }
  };

  useEffect(() => {
    if (!isAuthChecked) {
      checkAuthStatus();
    }
  }, [isAuthChecked]);

  useEffect(() => {
    if (isAuthorized && isAuthChecked) {
      fetchLichessAccount(sessionStorage.getItem('lichessToken')).then((account) => {
        if (account) {
          setUsername(account.username);
          setProfileUrl(account.url);
        } else {
          showSnackbar("Failed to fetch account information.", "error");
        }
      });
    }
  }, [isAuthorized, isAuthChecked]);

  return { isAuthorized, username, profileUrl, lichessLogin, lichessLogout };
}
