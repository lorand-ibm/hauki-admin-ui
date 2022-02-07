import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconCrossCircleFill, Navigation } from 'hds-react';
import api from '../../common/utils/api/api';
import { useAppContext } from '../../App-context';
import { AuthContextProps, TokenKeys, useAuth } from '../../auth/auth-context';
import './HaukiNavigation.scss';
import { SecondaryButton } from '../button/Button';
import toast from '../notification/Toast';

export default function HaukiNavigation(): JSX.Element {
  const { hasOpenerWindow, closeAppWindow } = useAppContext();
  const authProps: Partial<AuthContextProps> = useAuth();
  const { authTokens, clearAuth } = authProps;
  const history = useHistory();
  const isAuthenticated = !!authTokens;

  const showSignOutErrorNotification = (text: string): void =>
    toast.error({
      label: 'Uloskirjautuminen epäonnistui',
      text,
    });

  const signOut = async (): Promise<void> => {
    try {
      const isAuthInvalidated = await api.invalidateAuth();
      if (isAuthInvalidated) {
        if (clearAuth) {
          clearAuth();
        }
        history.push('/');
      } else {
        showSignOutErrorNotification('Uloskirjautuminen hylättiin.');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed:', e.message);
      showSignOutErrorNotification(
        `Uloskirjautuminen epäonnistui. Yritä myöhemmin uudestaan. Virhe: ${e}`
      );
    }
  };

  return (
    <Navigation
      theme={{
        '--header-background-color': 'var(--hauki-header-background-color)',
        '--header-color': 'var(--hauki-header-color)',
      }}
      className="navigation-header"
      title="Aukiolot"
      menuToggleAriaLabel="Menu"
      skipTo="#main"
      skipToContentLabel="Siirry pääsisältöön">
      <Navigation.Actions>
        <Navigation.User
          authenticated={isAuthenticated}
          label="Kirjaudu"
          userName={authTokens && authTokens[TokenKeys.usernameKey]}>
          <Navigation.Item
            label="Kirjaudu ulos"
            target="_blank"
            variant="primary"
            onClick={(): Promise<void> => signOut()}
          />
        </Navigation.User>
        {hasOpenerWindow && (
          <SecondaryButton
            dataTest="close-window-button"
            className="navigation-button"
            iconRight={<IconCrossCircleFill aria-hidden />}
            onClick={(): void => {
              if (closeAppWindow) {
                closeAppWindow();
              }
            }}
            variant="secondary"
            light>
            Sulje
          </SecondaryButton>
        )}
      </Navigation.Actions>
    </Navigation>
  );
}
