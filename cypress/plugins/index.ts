/// <reference types="cypress" />
/// <reference types="node" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

import childProcess from 'child_process';

const pluginFunction: Cypress.PluginConfig = function plugin(on, config) {
  const { env } = config;

  const authQueryParameters = childProcess.execFileSync('node', [
    './scripts/generate-auth-params.js',
  ]);

  return {
    ...config,
    env: { ...env, 'auth-query-parameters': authQueryParameters.toString() },
  };
};

export default pluginFunction;
