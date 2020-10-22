import React, { ReactElement, useEffect, useState } from 'react';
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
  storeTokens,
  getTokens,
  removeTokens,
  convertParamsToTokens,
  isValidAuthParams,
  AuthContext,
} from './auth/auth-context';
import api from './common/utils/api/api';
import Main from './components/main/Main';
import NavigationAndFooterWrapper from './components/navigation-and-footer-wrapper/NavigationAndFooterWrapper';
import './App.scss';
import TargetPage from './target/page/TargetPage';

export default function App(): JSX.Element {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [authTokensState, setAuthTokensState] = useState<
    AuthTokens | undefined
  >();

  useEffect(() => {
    const existingAuthTokens: AuthTokens | undefined = getTokens();
    const queryParams: ParsedUrlQuery = querystring.parse(
      window.location.search.replace('?', '')
    );

    const authTokensFromQuery = isValidAuthParams(queryParams)
      ? convertParamsToTokens(queryParams)
      : undefined;

    const authTokens = authTokensFromQuery || existingAuthTokens;

    if (authTokens) {
      api
        .testAuthCredentials(authTokens)
        .then(() => {
          storeTokens(authTokens);
          setAuthTokensState(authTokens);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          removeTokens();
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1>Sovellus käynnistyy..</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authTokens: authTokensState }}>
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
