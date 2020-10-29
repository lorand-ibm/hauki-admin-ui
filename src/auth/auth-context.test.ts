/// <reference types="jest" />

import { parseAuthParams } from './auth-context';

describe('Auth Context', () => {
  describe('parseAuthParams', () => {
    it('parses auth parameters from query string', () => {
      expect(
        parseAuthParams(
          '?username=admin@hel.fi&signature=1234567&valid_until=2020-10-02&created_at=2020-10-01'
        )
      ).toEqual({
        username: 'admin@hel.fi',
        signature: '1234567',
        valid_until: '2020-10-02',
        created_at: '2020-10-01',
      });
    });

    it('returns undefined when a required parameter is missing', () => {
      expect(
        parseAuthParams(
          '?username=admin@hel.fi&valid_until=2020-10-02&created_at=2020-10-01'
        )
      ).toEqual(undefined);
    });
  });
});
