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
  pickAuthParams,
  AuthContext,
} from './auth/auth-context';
import api from './common/utils/api/api';
import Main from './components/main/Main';
import NavigationAndFooterWrapper from './components/navigation-and-footer-wrapper/NavigationAndFooterWrapper';
import './App.scss';
import TargetPage from './target/page/TargetPage';

type OptionalAuthTokens = AuthTokens | undefined;

export default function App(): JSX.Element {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [authTokens, setAuthTokens] = useState<OptionalAuthTokens>();

  useEffect(() => {
    const storedAuthTokens: OptionalAuthTokens = getTokens();
    const queryParams: ParsedUrlQuery = querystring.parse(
      window.location.search.replace('?', '')
    );
    const authTokensFromQuery: OptionalAuthTokens = pickAuthParams(queryParams);

    const authTokensFromQueryOrStore: OptionalAuthTokens =
      authTokensFromQuery || storedAuthTokens;

    if (authTokensFromQueryOrStore) {
      api
        .testAuthCredentials(authTokensFromQueryOrStore)
        .then(() => {
          storeTokens(authTokensFromQueryOrStore);
          setAuthTokens(authTokensFromQueryOrStore);
          setLoading(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(`Authentication failed: ${e.message}`);
          setLoading(false);
          setAuthTokens(undefined);
          removeTokens();
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authTokens }}>
        <Router>
          <NavigationAndFooterWrapper>
            <Main id="main">
              {isLoading ? (
                <div>
                  <h1>Sovellus käynnistyy..</h1>
                </div>
              ) : (
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
              )}
            </Main>
          </NavigationAndFooterWrapper>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}
