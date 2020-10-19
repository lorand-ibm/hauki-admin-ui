import { createContext, useContext } from 'react';
import { ParsedUrlQuery } from 'querystring';
import {
  getStorageItem,
  setStorageItem,
} from '../common/utils/storage/storage';

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

export const setTokens = (
  authTokens: AuthTokens | undefined
): AuthTokens | undefined => setStorageItem('tokens', authTokens);

export const getTokens = (): AuthTokens | undefined => getStorageItem('tokens');

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

export const AuthContext = createContext<Partial<AuthContextProps>>({});

export function useAuth(): Partial<AuthContextProps> {
  return useContext(AuthContext);
}
