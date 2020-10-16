import React, { useState } from 'react';
import { Navigation } from 'hds-react';
import { AuthContextProps, useAuth } from '../../auth/auth-context';

export default function HaukiNavigation(): JSX.Element {
  const authProps: Partial<AuthContextProps> = useAuth();
  const isAuthenticated = !!authProps.tokens;

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

  return (
    <Navigation
      className="navigation-header"
      title="Aukiolot"
      menuCloseAriaLabel="Avaa menu"
      menuOpenAriaLabel="Sulje menu"
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
          onSignIn={(): void => console.log('plaa')}
          userName={authProps.tokens?.username}>
          <Navigation.Item
            label="Profiili"
            href="https://hel.fi"
            target="_blank"
            variant="primary"
          />
          <Navigation.Item
            as="button"
            type="button"
            onClick={(): void => console.log('plaa')}
            variant="secondary"
            label="Kirjaudu ulos"
          />
        </Navigation.User>

        <Navigation.LanguageSelector
          ariaLabel="Valittu kieli"
          options={languageOptions}
          formatSelectedValue={formatSelectedValue}
          onLanguageChange={setLanguage}
          value={language}
        />
      </Navigation.Actions>
    </Navigation>
  );
}
