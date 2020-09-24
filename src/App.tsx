import React, { ReactElement } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import 'hds-core';
import NavigationAndFooterWrapper from './components/navigation-and-footer-wrapper/NavigationAndFooterWrapper';
import './App.scss';
import TargetPage from './target/page/TargetPage';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <NavigationAndFooterWrapper>
          <main role="main" id="main">
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
          </main>
        </NavigationAndFooterWrapper>
      </Router>
    </div>
  );
}
