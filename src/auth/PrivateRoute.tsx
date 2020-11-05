import React, { ReactNode } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom';
import { AuthContextProps, useAuth } from './auth-context';

interface PrivateRouteProps extends RouteProps {
  id: string;
}

export default function (routeProps: PrivateRouteProps): JSX.Element {
  const authProps: Partial<AuthContextProps> = useAuth();
  const { isAuthenticated } = authProps;
  const { component, render, ...rest } = routeProps;

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps): JSX.Element | ReactNode => {
        if (isAuthenticated) {
          if (component) {
            return React.createElement(component);
          }
          if (render) {
            return render(props);
          }
        }
        return <Redirect to="/" />;
      }}
    />
  );
}
