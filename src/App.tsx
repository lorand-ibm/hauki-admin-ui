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
  Tokens,
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
  const existingTokens: Tokens | undefined = getTokens();

  const parameterTokens: ParsedUrlQuery = querystring.parse(
    window.location.search.replace('?', '')
  );

  const queryTokens = isValidAuthParams(parameterTokens)
    ? convertParamsToTokens(parameterTokens)
    : undefined;

  useEffect(() => {
    setTokens(existingTokens || queryTokens);
  }, [existingTokens, queryTokens]);

  return (
    <div className="App">
      <AuthContext.Provider value={{ tokens: queryTokens }}>
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
