import React, { useState } from 'react';
import { Navigation } from 'hds-react';
import { AuthContextProps, useAuth } from '../../auth/auth-context';
import './HaukiNavigation.scss';

export default function HaukiNavigation(): JSX.Element {
  const authProps: Partial<AuthContextProps> = useAuth();
  const { authTokens, isAuthenticated } = authProps;

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
      theme={{
        '--header-background-color': 'var(--color-coat-of-arms)',
        '--header-color': 'var(--color-white)',
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
            label="Profiili"
            href="https://hel.fi"
            target="_blank"
            variant="primary"
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
