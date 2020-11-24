import React, { ReactNode, useEffect, useState } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom';
import { AuthContextProps, useAuth } from '../auth/auth-context';
import api from '../common/utils/api/api';

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
  const { render, id, ...rest } = routeProps;
  const resourceId = rest.computedMatch?.params.id;
  const { authTokens, clearAuth }: Partial<AuthContextProps> = useAuth();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (!resourceId || !authTokens) {
      setLoading(false);
    } else {
      api
        .testPostPermission(resourceId)
        .then((hasPermission) => {
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
  }, [id, authTokens, clearAuth, resourceId]);

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps): JSX.Element | ReactNode => {
        if (!render) {
          // eslint-disable-next-line no-console
          console.error(
            'Missing required render prop from PrivateResourceRoute-attributes'
          );
          return <Redirect to="/" />;
        }

        if (isLoading) {
          return (
            <div>
              <h1>Sivua alustetaan..</h1>
            </div>
          );
        }

        if (!authTokens) {
          return <Redirect to="/" />;
        }

        if (!isAuthorized) {
          return <Redirect to="/unauthorized" />;
        }

        return render(props);
      }}
    />
  );
}
