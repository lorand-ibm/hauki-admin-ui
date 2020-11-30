/// <reference types="node"/>
import querystring, { ParsedUrlQuery } from 'querystring';
import { Context, createContext, useContext } from 'react';

export enum TokenKey {
  usernameKey = 'hsa_username',
  resourceKey = 'hsa_resource',
  organizationKey = 'hsa_organization',
  signatureKey = 'signature',
  validUntilKey = 'hsa_valid_until',
  createdAtKey = 'hsa_created_at',
  sourceKey = 'hsa_source',
}

export interface AuthTokens {
  [TokenKey.usernameKey]: string;
  [TokenKey.resourceKey]: string;
  [TokenKey.organizationKey]: string;
  [TokenKey.signatureKey]: string;
  [TokenKey.validUntilKey]: string;
  [TokenKey.createdAtKey]: string;
  [TokenKey.sourceKey]: string;
}

const authKeys = [
  TokenKey.usernameKey,
  TokenKey.signatureKey,
  TokenKey.validUntilKey,
  TokenKey.createdAtKey,
  TokenKey.resourceKey,
  TokenKey.organizationKey,
  TokenKey.sourceKey,
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
  authTokens: AuthTokens | undefined;
  clearAuth: () => void;
};

export const AuthContext: Context<{}> = createContext({});

export function useAuth(): Partial<AuthContextProps> {
  return useContext(AuthContext);
}
