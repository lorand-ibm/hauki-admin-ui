import axios from 'axios';
import apiRequest, { Target } from './api-request';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiRequest - getTarget', () => {
  it('fetches target by id', (done) => {
    const targetMock: Target = {
      id: '8100',
      name: 'Toimipiste A',
      description: '',
    };
    mockedAxios.get.mockResolvedValue({ data: targetMock });

    apiRequest.getTarget('8100');

    expect(mockedAxios.request).toHaveBeenCalledTimes(1);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      headers: { 'Content-Type': 'application/json' },
      method: 'get',
      params: { format: 'json' },
      url: 'http://localhost:8000/v1/target/tprek:8100',
    });
    done();
  });
});
