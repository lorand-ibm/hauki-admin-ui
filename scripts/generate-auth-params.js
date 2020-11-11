// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const key = process.env.HAUKI_KEY;
const username = process.env.HAUKI_USER;
const resource = process.env.HAUKI_RESOURCE;
const organization = process.env.HAUKI_ORGANIZATION;
const now = new Date();
const createdAt = now.toJSON();
const validUntil =
  process.env.HAUKI_VALID_UNTIL ||
  new Date(now.setDate(now.getDate() + 7)).toJSON();

const signatureStr = `${username}${createdAt}${validUntil}${organization}${resource}`;

const signature = crypto
  .createHmac('sha256', Buffer.from(key, 'utf-8'))
  .update(Buffer.from(signatureStr, 'utf-8'))
  .digest('hex');

const queryParameters = [
  `username=${encodeURIComponent(username)}`,
  `created_at=${encodeURIComponent(createdAt)}`,
  `valid_until=${encodeURIComponent(validUntil)}`,
  `resource=${encodeURIComponent(resource)}`,
  `organization=${encodeURIComponent(organization)}`,
  `signature=${signature}`,
].join('&');

process.stdout.write(queryParameters);
