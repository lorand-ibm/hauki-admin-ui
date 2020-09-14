import axios, { AxiosResponse } from 'axios';

const apiBaseUrl: string =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const TARGET_BASE_PATH = '/target';

interface RequestParameters {
  [key: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string>
    | ReadonlyArray<number>
    | ReadonlyArray<boolean>
    | undefined
    | null;
}

interface FetchGetParameters {
  path: string;
  parameters?: RequestParameters;
}

interface ApiGetParameters extends RequestParameters {
  format: 'json';
}

async function apiGet<T>({
  path,
  parameters = {},
}: FetchGetParameters): Promise<T> {
  const apiParameters: ApiGetParameters = { ...parameters, format: 'json' };
  const response = await axios.request<T, AxiosResponse<T>>({
    url: `${apiBaseUrl}/v1${path}`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'get',
    params: apiParameters,
  });

  return response.data;
}

export interface Target {
  id: string;
  name: string;
  description: string;
}

const getTarget = (id: string): Promise<Target> =>
  apiGet<Target>({ path: `${TARGET_BASE_PATH}/tprek:${id}` });

export default { getTarget };
