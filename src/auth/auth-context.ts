/// <reference types="node"/>
import { Context, createContext, useContext } from 'react';
import { SearchParameters } from '../common/utils/url/url';
import { localStorage } from '../common/utils/storage/storage';

export enum TokenKeys {
  usernameKey = 'hsa_username',
  resourceKey = 'hsa_resource',
  organizationKey = 'hsa_organization',
  signatureKey = 'hsa_signature',
  validUntilKey = 'hsa_valid_until',
  createdAtKey = 'hsa_created_at',
  sourceKey = 'hsa_source',
  hasOrganizationRights = 'hsa_has_organization_rights',
}

export interface AuthTokens {
  [TokenKeys.usernameKey]: string;
  [TokenKeys.resourceKey]: string;
  [TokenKeys.organizationKey]: string;
  [TokenKeys.signatureKey]: string;
  [TokenKeys.validUntilKey]: string;
  [TokenKeys.createdAtKey]: string;
  [TokenKeys.sourceKey]: string;
  [TokenKeys.sourceKey]: string;
  [TokenKeys.hasOrganizationRights]: string;
}

const authKeys = [
  TokenKeys.usernameKey,
  TokenKeys.signatureKey,
  TokenKeys.validUntilKey,
  TokenKeys.createdAtKey,
  TokenKeys.resourceKey,
  TokenKeys.organizationKey,
  TokenKeys.sourceKey,
  TokenKeys.hasOrganizationRights,
];

const tokenStorageKey: 'tokens' = 'tokens';

export const storeTokens = (
  authTokens: AuthTokens | undefined
): AuthTokens | undefined =>
  localStorage.storeItem<AuthTokens | undefined>({
    key: tokenStorageKey,
    value: authTokens,
  });

export const removeTokens = (): void =>
  localStorage.removeItem(tokenStorageKey);

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

export const parseAuthParams = (
  searchParams: SearchParameters
): AuthTokens | undefined => {
  const authParams = authKeys.reduce((acc, key) => {
    const paramValue: string | string[] | undefined = searchParams[key];
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
