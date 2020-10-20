import React, { useState } from 'react';
import { IconInfoCircle, Navigation, Button } from 'hds-react';
import OpeningPeriodCard from '../opening-period-card/OpeningPeriodCard';
import Collapse from '../../components/collapse/Collapse';
import './TargetOpeningHours.scss';

export default function TargetOpeningHours({
  id,
}: {
  id: string;
}): JSX.Element {
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
    <section className="target-opening-hours-section">
      <Collapse
        isOpen
        collapseContentId={`${id}-opening-hours-section`}
        title="Toimipisteen aukiolotiedot">
        <p>
          Toimipisteen aukiolotietoja muokataan jaksokohtaisesti. Aukiolojaksot
          voivat olla julkaistuja tai julkaisemattomia. Alla voit selata myös
          tulevia ja menneitä aukiolojaksoja. Näet alla myös eri kieliversiot
          valitsemalla kielen valikosta. Huomioithan, että palvelu voi itse
          valita aukiolojaksojen esitystavan, se ei välttämättä ole alla näkyvän
          kaltainen.
        </p>
        <header className="target-opening-hours-header">
          <div className="opening-periods-info-container">
            <h3 className="opening-periods-title">Aukiolojaksot</h3>
            <IconInfoCircle className="opening-periods-info" />
          </div>
          <div className="opening-periods-info-container">
            <p className="period-count">4 jaksoa</p>
            <Navigation.LanguageSelector
              className="opening-periods-language-selector"
              ariaLabel="Aukioloaikojen valittu kieli"
              options={languageOptions}
              formatSelectedValue={formatSelectedValue}
              onLanguageChange={setLanguage}
              value={language}
            />
            <Button
              size="small"
              className="add-new-opening-period-button"
              variant="secondary">
              Lisää uusi +
            </Button>
          </div>
        </header>
        <div className="opening-period-cards-container">
          <OpeningPeriodCard />
          <OpeningPeriodCard />
          <OpeningPeriodCard />
          <OpeningPeriodCard />
        </div>
      </Collapse>
    </section>
  );
}
