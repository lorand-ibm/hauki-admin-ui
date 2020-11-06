/// <reference types="jest" />

import axios from 'axios';
import api, { Resource } from './api';
import * as auth from '../../../auth/auth-context';
import { AuthTokens } from '../../../auth/auth-context';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('request', () => {
    it('adds auth-tokens into every request', async (done) => {
      const signature = '123456';
      const queryTokens = {
        username: 'admin@hel.fi',
        created_at: '2020-11-05T09%3A38%3A36.198Z',
        valid_until: '2020-11-12T09%3A38%3A36.198Z',
      };
      const mockTokens = { ...queryTokens, signature } as AuthTokens;

      jest.spyOn(auth, 'getTokens').mockImplementationOnce(() => mockTokens);

      mockedAxios.request.mockResolvedValue({ data: 'ok' });

      await api.testAuth();

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request).toHaveBeenCalledWith({
        headers: {
          'Content-Type': 'application/json',
          Authorization: `haukisigned signature=${signature}`,
        },
        method: 'get',
        params: { format: 'json', ...queryTokens },
        url: 'http://localhost:8000/v1/auth_required_test',
      });

      done();
    });
  });

  describe('getResource', () => {
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
});
