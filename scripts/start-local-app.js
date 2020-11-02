// eslint-disable-next-line @typescript-eslint/no-var-requires
const childProcess = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const openBrowser = require('react-dev-utils/openBrowser');

const [, , url] = process.argv;

const queryParams = childProcess.execFileSync('node', [
  './scripts/generate-auth-params.js',
]);

const fullUrl = `${url}?${queryParams}`;
process.env.BROWSER = ''; // We need to unset the browser to be able to call openBrowser with updated data.
openBrowser(fullUrl);
