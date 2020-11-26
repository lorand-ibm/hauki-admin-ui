import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Navigation, Notification } from 'hds-react';
import api from '../../common/utils/api/api';
import { AuthContextProps, useAuth } from '../../auth/auth-context';
import './HaukiNavigation.scss';

export default function HaukiNavigation(): JSX.Element {
  const [signOutError, setSignError] = useState<string | undefined>();
  const authProps: Partial<AuthContextProps> = useAuth();
  const history = useHistory();
  const { authTokens, clearAuth } = authProps;
  const isAuthenticated = !!authTokens;

  interface LanguageOption {
    label: string;
    value: string;
  }

  const languageOptions: LanguageOption[] = [
    { label: 'Suomeksi', value: 'fi' },
    { label: 'Svenska', value: 'sv' },
    { label: 'English', value: 'en' },
  ];

  const [language, setLanguage] = useState(languageOptions[0]);
  const formatSelectedValue = ({ value }: LanguageOption): string =>
    value.toUpperCase();

  const signOut = async (): Promise<void> => {
    try {
      const success = await api.invalidateAuth();
      if (success) {
        setSignError(undefined);
        if (clearAuth) {
          clearAuth();
        }
        history.push('/');
      } else {
        setSignError(`Uloskirjautuminen hylättiin.`);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed:', e.message);
      setSignError(
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
      {isAuthenticated && (
        <Navigation.Row>
          <Navigation.Item label="Toimipistehaku" />
          <Navigation.Item label="Paikat" />
          <Navigation.Item label="Anna palautetta" />
          <Navigation.Item label="Tietoa palvelusta" />
        </Navigation.Row>
      )}

      <Navigation.Actions>
        <Navigation.User
          authenticated={isAuthenticated}
          label="Kirjaudu"
          userName={authTokens?.username}>
          <Navigation.Item
            label="Kirjaudu ulos"
            target="_blank"
            variant="primary"
            onClick={(): Promise<void> => signOut()}
          />
        </Navigation.User>
        <Navigation.LanguageSelector label={formatSelectedValue(language)}>
          {languageOptions.map((languageOption) => (
            <Navigation.Item
              key={languageOption.value}
              label={languageOption.label}
              onClick={(
                e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
              ): void => {
                e.preventDefault();
                setLanguage(languageOption);
              }}
            />
          ))}
        </Navigation.LanguageSelector>
      </Navigation.Actions>
      {signOutError && (
        <Notification
          position="top-right"
          autoClose
          size="small"
          label="Uloskirjautuminen epäonnistui"
          type="error">
          {signOutError}
        </Notification>
      )}
    </Navigation>
  );
}
