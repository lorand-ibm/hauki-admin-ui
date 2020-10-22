import { Context, createContext, useContext } from 'react';
import { ParsedUrlQuery } from 'querystring';

const usernameKey = 'username';
const resourceKey = 'resource';
const organizationKey = 'organization';
const signatureKey = 'signature';
const validUntilKey = 'valid_until';
const createdAtKey = 'created_at';

export interface AuthTokens {
  [usernameKey]: string;
  [resourceKey]: string;
  [organizationKey]: string;
  [signatureKey]: string;
  [validUntilKey]: string;
  [createdAtKey]: string;
}

const tokenKeys = [
  usernameKey,
  resourceKey,
  organizationKey,
  signatureKey,
  validUntilKey,
  createdAtKey,
];

const tokenStorageKey: 'tokens' = 'tokens';

export const setTokens = (
  authTokens: AuthTokens | undefined
): AuthTokens | undefined => {
  try {
    window.localStorage.setItem(tokenStorageKey, JSON.stringify(authTokens));
    return authTokens;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return undefined;
  }
};

export const removeTokens = (): void => {
  try {
    window.localStorage.removeItem(tokenStorageKey);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getTokens = (): AuthTokens | undefined => {
  try {
    const item = window.localStorage.getItem(tokenStorageKey);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return undefined;
  }
};

export const isValidAuthParams = (item: {
  [key: string]: unknown;
}): boolean => {
  const itemKeys: string[] = Object.keys(item).sort();
  return JSON.stringify(tokenKeys.sort()) === JSON.stringify(itemKeys);
};

export const convertParamsToTokens = (urlParams: ParsedUrlQuery): AuthTokens =>
  (urlParams as unknown) as AuthTokens;

export type AuthContextProps = {
  authTokens: AuthTokens;
};

export const AuthContext: Context<{}> = createContext({});

export function useAuth(): Partial<AuthContextProps> {
  return useContext(AuthContext);
}
