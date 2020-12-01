import React, { ReactNode, useEffect, useState } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
  useLocation,
} from 'react-router-dom';
import { AuthContextProps, useAuth } from '../auth/auth-context';
import api from '../common/utils/api/api';

const PermissionResolver = ({
  id,
  children,
}: {
  id?: string;
  children?: ReactNode;
}): JSX.Element => {
  const { authTokens, clearAuth }: Partial<AuthContextProps> = useAuth();
  const { search } = useLocation();
  const isAuthenticated = !!authTokens;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setLoading(false);
    } else {
      api
        .testResourcePostPermission(id)
        .then((hasPermission: boolean) => {
          setIsAuthorized(hasPermission);
          setLoading(false);
        })
        .catch(() => {
          if (clearAuth) {
            clearAuth();
          }
          setLoading(false);
        });
    }
  }, [clearAuth, id, isAuthenticated]);

  if (isLoading) {
    return (
      <div>
        <h1>Sivua alustetaan..</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to={{ pathname: '/unauthenticated', search }} />;
  }

  if (!isAuthorized) {
    return <Redirect to={{ pathname: '/unauthorized', search }} />;
  }

  return <>{children}</>;
};

type ComputedMatch = {
  params: {
    id?: string;
  };
};

interface PrivateRouteProps extends RouteProps {
  computedMatch?: ComputedMatch;
  id: string;
}

export default function (routeProps: PrivateRouteProps): JSX.Element {
  const { render, ...rest } = routeProps;

  return (
    <Route
      {...rest}
      render={(
        props: RouteComponentProps<{ id: string }>
      ): JSX.Element | ReactNode => {
        if (!render) {
          // eslint-disable-next-line no-console
          console.error(
            'Missing required render prop from PrivateResourceRoute-attributes'
          );
          return <Redirect to="/" />;
        }

        return (
          <PermissionResolver
            key={props.location.key}
            id={props.match.params.id}>
            {render(props)}
          </PermissionResolver>
        );
      }}
    />
  );
}
