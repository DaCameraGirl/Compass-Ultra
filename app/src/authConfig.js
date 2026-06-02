const DEFAULT_AUTH0_DOMAIN = 'compassultra.us.auth0.com';
const DEFAULT_AUTH0_CLIENT_ID = 'XnScfnNJsKiooRvxExyX9geuWGnJb2QV';
const DEFAULT_AUTH0_AUDIENCE = 'https://api.compass-ultra.com';
const DEFAULT_AUTH0_CALLBACK_PATH = '/app';

const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN || DEFAULT_AUTH0_DOMAIN;
export const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || DEFAULT_AUTH0_CLIENT_ID;
export const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE || DEFAULT_AUTH0_AUDIENCE;

export function getAuth0RedirectUri() {
  const configuredRedirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;
  if (configuredRedirectUri) return configuredRedirectUri;

  const configuredOrigin = import.meta.env.VITE_PUBLIC_APP_ORIGIN || import.meta.env.VITE_APP_ORIGIN;
  const origin = configuredOrigin ? trimTrailingSlashes(configuredOrigin) : window.location.origin;
  return `${origin}${DEFAULT_AUTH0_CALLBACK_PATH}`;
}

export function getAuth0LogoutReturnTo() {
  const configuredReturnTo = import.meta.env.VITE_AUTH0_LOGOUT_RETURN_TO;
  if (configuredReturnTo) return configuredReturnTo;

  try {
    return new URL(getAuth0RedirectUri()).origin;
  } catch {
    return window.location.origin;
  }
}
