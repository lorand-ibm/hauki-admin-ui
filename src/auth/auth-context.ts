/// <reference types="node"/>
import querystring, { ParsedUrlQuery } from 'querystring';
import { Context, createContext, useContext } from 'react';

const usernameKey = 'username';
const resourceKey = 'resource';
const organizationKey = 'organization';
const signatureKey = 'signature';
const validUntilKey = 'valid_until';
const createdAtKey = 'created_at';
const sourceKey = 'source';

export interface AuthTokens {
  [usernameKey]: string;
  [resourceKey]: string;
  [organizationKey]: string;
  [signatureKey]: string;
  [validUntilKey]: string;
  [createdAtKey]: string;
  [sourceKey]: string;
}

const authKeys = [
  usernameKey,
  signatureKey,
  validUntilKey,
  createdAtKey,
  resourceKey,
  organizationKey,
  sourceKey,
];

const tokenStorageKey: 'tokens' = 'tokens';

export const storeTokens = (
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

export const removeTokens = (): void =>
  window.localStorage.removeItem(tokenStorageKey);

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

export const parseAuthParams = (queryStr: string): AuthTokens | undefined => {
  const queryParams: ParsedUrlQuery = querystring.parse(
    queryStr.replace('?', '')
  );
  const authParams = authKeys.reduce((acc, key) => {
    const paramValue: string | string[] | undefined = queryParams[key];
    const value = typeof paramValue === 'string' ? paramValue : paramValue?.[0];
    if (value) {
      return { ...acc, [key]: decodeURIComponent(value) };
    }
    return acc;
  }, {});

  if (
    authKeys.sort().toString() === Object.keys(authParams).sort().toString()
  ) {
    return (authParams as unknown) as AuthTokens;
  }

  return undefined;
};

export type AuthContextProps = {
  authTokens: AuthTokens;
  isAuthenticated: boolean;
};

export const AuthContext: Context<{}> = createContext({});

export function useAuth(): Partial<AuthContextProps> {
  return useContext(AuthContext);
}
