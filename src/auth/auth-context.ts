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

const requiredAuthKeys = [
  usernameKey,
  signatureKey,
  validUntilKey,
  createdAtKey,
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

export const pickAuthParams = (
  parameters: ParsedUrlQuery
): AuthTokens | undefined => {
  const authParameterKeys: string[] = Object.keys(parameters)
    .filter((parameter) => requiredAuthKeys.includes(parameter))
    .sort();

  const hasAuthParams =
    JSON.stringify(requiredAuthKeys.sort()) ===
    JSON.stringify(authParameterKeys);

  return hasAuthParams
    ? (requiredAuthKeys.reduce(
        (acc, key) => Object.assign(acc, { [key]: parameters[key] }),
        {}
      ) as AuthTokens)
    : undefined;
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
