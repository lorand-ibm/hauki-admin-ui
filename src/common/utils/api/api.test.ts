/// <reference types="jest" />

import axios from 'axios';
import api, { Target } from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiRequest - getTarget', () => {
  it('fetches target by id', async (done) => {
    const mockTarget: Target = {
      id: '8100',
      name: 'Toimipiste A',
      address: 'Helsinki',
      description: '',
    };

    mockedAxios.request.mockResolvedValue({ data: mockTarget });

    const response = await api.getTarget('tprek:8100');

    expect(mockedAxios.request).toHaveBeenCalledTimes(1);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      headers: { 'Content-Type': 'application/json' },
      method: 'get',
      params: { format: 'json' },
      url: 'http://localhost:8000/v1/target/tprek:8100',
    });

    expect(response).toBe(mockTarget);

    done();
  });
});
