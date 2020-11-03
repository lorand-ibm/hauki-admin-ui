// eslint-disable-next-line @typescript-eslint/no-var-requires
const childProcess = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const openBrowser = require('react-dev-utils/openBrowser');

const [, , url] = process.argv;

const queryParams = childProcess.execFileSync('node', [
  './scripts/generate-auth-params.js',
]);

const fullUrl = `${url}?${queryParams}`;
process.env.BROWSER = ''; // We need to unset the BROWSER so the openBrowser won't call this script again. This was set in package.json. Now it will use the updated url to open the browser.
openBrowser(fullUrl);
