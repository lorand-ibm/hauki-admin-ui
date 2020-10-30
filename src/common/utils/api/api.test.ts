/// <reference types="jest" />

import axios from 'axios';
import api, { Resource } from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiRequest - getResource', () => {
  it('fetches resource by id', async (done) => {
    const mockResource: Resource = {
      id: 'tprek:1000',
      name: {
        fi: 'Test resource name in finnish',
        sv: 'Test resource name in swedish',
        en: 'Test resource name in english',
      },
      address: {
        fi: 'Test address in finnish',
        sv: 'Test address in swedish',
        en: 'Test address in english',
      },
      description: {
        fi: 'Test description in finnish',
        sv: 'Test description in swedish',
        en: 'Test description in english',
      },
      extra_data: {
        citizen_url: 'kansalaisen puolen url',
        admin_url: 'admin puolen url',
      },
    };

    mockedAxios.request.mockResolvedValue({ data: mockResource });

    const response = await api.getResource('tprek:8100');

    expect(mockedAxios.request).toHaveBeenCalledTimes(1);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      headers: { 'Content-Type': 'application/json' },
      method: 'get',
      params: { format: 'json' },
      url: 'http://localhost:8000/v1/resource/tprek:8100',
    });

    expect(response).toBe(mockResource);

    done();
  });
});
