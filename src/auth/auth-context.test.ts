/// <reference types="jest" />

import { parseAuthParams } from './auth-context';

describe('Auth Context', () => {
  describe('parseAuthParams', () => {
    it('parses auth parameters from query string', () => {
      expect(
        parseAuthParams(
          '?username=admin@hel.fi&signature=1234567&valid_until=2020-11-05T16%3A20%3A00&created_at=2020-11-05T16%3A10%3A00&organization=12345&resource=tprek%3A8215'
        )
      ).toEqual({
        username: 'admin@hel.fi',
        signature: '1234567',
        valid_until: '2020-11-05T16:20:00',
        created_at: '2020-11-05T16:10:00',
        organization: '12345',
        resource: 'tprek:8215',
      });
    });

    it('returns undefined when a required parameter is missing', () => {
      expect(
        parseAuthParams(
          '?username=admin@hel.fi&signature=1234567&valid_until=2020-11-05T16%3A20%3A00&created_at=2020-11-05T16%3A10%3A00'
        )
      ).toEqual(undefined);
    });
  });
});
