import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  DatePeriod,
  LanguageStrings,
  Resource,
  ResourceState,
  TimeSpanGroup,
} from '../../lib/types';
import { AuthTokens, getTokens } from '../../../auth/auth-context';

const apiBaseUrl: string = window.ENV?.API_URL || 'http://localhost:8000';

const resourceBasePath = '/resource';
const datePeriodBasePath = '/date_period';
const authRequiredTest = '/auth_required_test';

interface RequestParameters {
  [key: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string>
    | ReadonlyArray<number>
    | ReadonlyArray<boolean>
    | undefined
    | LanguageStrings
    | TimeSpanGroup[]
    | ResourceState
    | null;
}

interface GetParameters {
  path: string;
  headers?: { [key: string]: string };
  parameters?: RequestParameters;
}

interface PostParameters {
  path: string;
  headers?: { [key: string]: string };
  data?: RequestParameters;
}

enum ApiResponseFormat {
  json = 'json',
}

interface ApiParameters extends RequestParameters {
  format: ApiResponseFormat;
}

const addTokensToRequestConfig = (
  authTokens: AuthTokens,
  config: AxiosRequestConfig
): AxiosRequestConfig => {
  const { signature, ...restOfTokens } = authTokens;
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `haukisigned signature=${signature}`,
    },
    params: { ...config.params, ...restOfTokens },
  };
};

async function request<T>(requestConfig: AxiosRequestConfig): Promise<T> {
  const authTokens: AuthTokens | undefined = getTokens();
  const config: AxiosRequestConfig = authTokens
    ? addTokensToRequestConfig(authTokens, requestConfig)
    : requestConfig;

  try {
    const response: AxiosResponse<T> = await axios.request<T, AxiosResponse<T>>(
      config
    );
    return response.data;
  } catch (error) {
    const errorMessage: string | undefined = error.response?.data?.detail;
    if (errorMessage) {
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

async function apiGet<T>({ path, parameters = {} }: GetParameters): Promise<T> {
  const apiParameters: ApiParameters = {
    ...parameters,
    format: ApiResponseFormat.json,
  };

  return request<T>({
    url: `${apiBaseUrl}/v1${path}`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'get',
    params: apiParameters,
  });
}

async function apiPost<T>({ path, data = {} }: PostParameters): Promise<T> {
  return request<T>({
    url: `${apiBaseUrl}/v1${path}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    data,
    validateStatus(status) {
      return status < 300;
    },
  });
}

interface AuthTestResponse {
  message: string;
  username: string;
}

export default {
  getResource: (id: string): Promise<Resource> =>
    apiGet<Resource>({ path: `${resourceBasePath}/${id}` }),

  getDatePeriods: (resourceId: number): Promise<DatePeriod[]> =>
    apiGet<DatePeriod[]>({
      path: `${datePeriodBasePath}`,
      parameters: { resource: resourceId, end_date_gte: '-1d' },
    }),

  postDatePeriod: (datePeriod: DatePeriod): Promise<DatePeriod> =>
    apiPost<DatePeriod>({
      path: `${datePeriodBasePath}`,
      data: datePeriod,
    }),

  testAuth: (): Promise<AuthTestResponse> =>
    apiGet<AuthTestResponse>({
      path: authRequiredTest,
    }),
};
