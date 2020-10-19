import React, { ReactElement, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import 'hds-core';
import querystring, { ParsedUrlQuery } from 'querystring';
import {
  AuthTokens,
  setTokens,
  getTokens,
  convertParamsToTokens,
  isValidAuthParams,
  AuthContext,
} from './auth/auth-context';
import Main from './components/main/Main';
import NavigationAndFooterWrapper from './components/navigation-and-footer-wrapper/NavigationAndFooterWrapper';
import './App.scss';
import TargetPage from './target/page/TargetPage';

export default function App(): JSX.Element {
  const existingAuthTokens: AuthTokens | undefined = getTokens();

  const queryParams: ParsedUrlQuery = querystring.parse(
    window.location.search.replace('?', '')
  );

  const authTokensFromQuery = isValidAuthParams(queryParams)
    ? convertParamsToTokens(queryParams)
    : undefined;

  const authTokens: AuthTokens | undefined =
    authTokensFromQuery || existingAuthTokens;

  useEffect(() => {
    setTokens(authTokens);
  }, [authTokens]);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authTokens }}>
        <Router>
          <NavigationAndFooterWrapper>
            <Main id="main">
              <Switch>
                <Route exact path="/">
                  <h1>Etusivu</h1>
                </Route>
                <Route
                  id="target-route"
                  exact
                  path="/target/:id"
                  render={({
                    match,
                  }: RouteComponentProps<{ id: string }>): ReactElement => (
                    <TargetPage id={match.params.id} />
                  )}
                />
              </Switch>
            </Main>
          </NavigationAndFooterWrapper>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}
