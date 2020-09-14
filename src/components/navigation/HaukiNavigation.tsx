import React, { useState } from 'react';
import { Navigation } from 'hds-react';
import './HaukiNavigation.css';

export default function HaukiNavigation(): JSX.Element {
  const [authenticated, setAuthenticated] = useState(false);

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
      {authenticated && (
        <Navigation.Row>
          <Navigation.Item label="Toimipistehaku" />
          <Navigation.Item label="Paikat" />
          <Navigation.Item label="Anna palautetta" />
          <Navigation.Item label="Tietoa palvelusta" />
        </Navigation.Row>
      )}

      <Navigation.Actions>
        <Navigation.User
          authenticated={authenticated}
          label="Kirjaudu"
          onSignIn={(): void => setAuthenticated(true)}
          userName="John Doe">
          <Navigation.Item
            label="Profiili"
            href="https://hel.fi"
            target="_blank"
            variant="primary"
          />
          <Navigation.Item
            as="button"
            type="button"
            onClick={(): void => setAuthenticated(false)}
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
