import React, { ReactElement, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import 'hds-core';
import {
  AuthTokens,
  storeTokens,
  getTokens,
  removeTokens,
  parseAuthParams,
  AuthContext,
} from './auth/auth-context';
import PrivateRoute from './auth/PrivateRoute';
import api from './common/utils/api/api';
import Main from './components/main/Main';
import NavigationAndFooterWrapper from './components/navigation-and-footer-wrapper/NavigationAndFooterWrapper';
import './App.scss';
import ResourcePage from './resource/page/ResourcePage';
import CreateNewOpeningPeriodPage from './opening-period/page/CreateNewOpeningPeriodPage';

type OptionalAuthTokens = AuthTokens | undefined;

export default function App(): JSX.Element {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [authTokens, setAuthTokens] = useState<OptionalAuthTokens>();

  const onAuthFail = (message: string): void => {
    // eslint-disable-next-line no-console
    console.error(`Authentication failed: ${message}`);
    setAuthTokens(undefined);
    setLoading(false);
  };

  useEffect(() => {
    const authTokensFromQuery: OptionalAuthTokens = parseAuthParams(
      window.location.search
    );

    if (authTokensFromQuery) {
      storeTokens(authTokensFromQuery);
    }

    const storedAuthTokens: OptionalAuthTokens = getTokens();

    if (storedAuthTokens) {
      api
        .testAuth()
        .then(() => {
          setAuthTokens(storedAuthTokens);
          setLoading(false);
        })
        .catch((erroMessage) => {
          onAuthFail(erroMessage);
          removeTokens();
        });
    } else {
      onAuthFail('Missing auth tokens');
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider
        value={{ authTokens, isAuthenticated: !!authTokens }}>
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
                  <PrivateRoute
                    id="resource-route"
                    exact
                    path="/resource/:id"
                    render={({
                      match,
                    }: RouteComponentProps<{ id: string }>): ReactElement => (
                      <ResourcePage id={match.params.id} />
                    )}
                  />
                  <PrivateRoute
                    id="create-new-opening-period-route"
                    exact
                    path="/resource/:id/period/new"
                    render={({
                      match,
                    }: RouteComponentProps<{
                      id: string;
                    }>): ReactElement => (
                      <CreateNewOpeningPeriodPage
                        resourceId={match.params.id}
                      />
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
