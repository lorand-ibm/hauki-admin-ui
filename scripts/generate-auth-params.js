// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const key =
  process.env.HAUKI_KEY ||
  'd94c278085e49e807b67a58b8fcb92239b3fe881252f1938e3e0ca09611684b3790df3a22c08a32959309fdfcf074b4204c2f84a1ef03025621c4cf23a5521f24299ba857956a1fcf1b61715cb8154baeedba4e0409e636da9e91d7a618a4403e748c3a2';

const username = process.env.HAUKI_USER || 'admin@hel.fi';
const resource = process.env.HAUKI_RESOURCE;
const organization = process.env.HAUKI_ORGANISATION;
const now = new Date();
const createdAt = now.toJSON();
const validUntil =
  process.env.HAUKI_VALID_UNTIL ||
  new Date(now.setDate(now.getDate() + 7)).toJSON();

const signatureStr = `${username}${createdAt}${validUntil}${resource || ''}${
  organization || ''
}`;

const signature = crypto
  .createHmac('sha256', Buffer.from(key, 'utf-8'))
  .update(Buffer.from(signatureStr, 'utf-8'))
  .digest('hex');

const queryParameters = [
  `username=${encodeURIComponent(username)}`,
  `created_at=${encodeURIComponent(createdAt)}`,
  `valid_until=${encodeURIComponent(validUntil)}`,
  resource ? `resource=${encodeURIComponent(resource)}` : undefined,
  organization ? `organization=${encodeURIComponent(organization)}` : undefined,
  `signature=${signature}`,
]
  .filter((s) => !!s)
  .join('&');

process.stdout.write(queryParameters);
