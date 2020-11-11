import React, { useState } from 'react';
import { IconInfoCircle, Navigation, Button } from 'hds-react';
import OpeningPeriod from './opening-period/OpeningPeriod';
import Collapse from '../../components/collapse/Collapse';
import './ResourceOpeningHours.scss';
import { DatePeriod } from '../../common/lib/types';

enum PeriodHeaderTheme {
  DEFAULT = 'DEFAULT',
  LIGHT = 'LIGHT',
}

const OpeningPeriodsHeader = ({
  title,
  count,
  theme,
}: {
  title: string;
  count: number;
  theme: PeriodHeaderTheme;
}) => {
  const className =
    theme === PeriodHeaderTheme.LIGHT
      ? 'opening-periods-header opening-periods-header-light'
      : 'opening-periods-header';

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
    <header className={className}>
      <div className="opening-periods-header-container">
        <h3 className="opening-periods-header-title">{title}</h3>
        <IconInfoCircle
          aria-label="Lisätietoja aukiolojaksoista nappi"
          className="opening-periods-header-info"
        />
      </div>
      <div className="opening-periods-header-container">
        <p className="period-count">{count} jaksoa</p>
        <Navigation.LanguageSelector
          className="opening-periods-header-language-selector"
          ariaLabel="Aukioloaikojen valittu kieli"
          options={languageOptions}
          formatSelectedValue={formatSelectedValue}
          onLanguageChange={setLanguage}
          value={language}
        />
        <Button
          size="small"
          className="opening-period-header-button"
          variant="secondary">
          Lisää uusi +
        </Button>
      </div>
    </header>
  );
};

export default function ResourceOpeningHours({
  id,
  datePeriods,
}: {
  id: string;
  datePeriods: DatePeriod[];
}): JSX.Element {
  const [
    defaultPeriods = [],
    exceptionPeriods = [],
  ]: DatePeriod[][] = datePeriods.reduce(
    ([defaults = [], exceptions = []]: DatePeriod[][], current: DatePeriod) => {
      return current.override
        ? [defaults, [...exceptions, current]]
        : [[...defaults, current], exceptions];
    },
    []
  );

  return (
    <Collapse
      isOpen
      collapseContentId={`${id}-opening-hours-section`}
      title="Toimipisteen aukiolotiedot">
      <p>
        Toimipisteen aukiolotietoja muokataan jaksokohtaisesti. Aukiolojaksot
        voivat olla julkaistuja tai julkaisemattomia. Alla voit selata myös
        tulevia ja menneitä aukiolojaksoja. Näet alla myös eri kieliversiot
        valitsemalla kielen valikosta. Huomioithan, että palvelu voi itse valita
        aukiolojaksojen esitystavan, se ei välttämättä ole alla näkyvän
        kaltainen.
      </p>
      <div className="opening-periods-section">
        <OpeningPeriodsHeader
          title="Aukiolojaksot"
          count={defaultPeriods.length}
          theme={PeriodHeaderTheme.DEFAULT}
        />
        <div className="opening-periods-list">
          {defaultPeriods.length > 0 ? (
            datePeriods.map((datePeriod: DatePeriod) => (
              <OpeningPeriod datePeriod={datePeriod} />
            ))
          ) : (
            <p>Ei aukiolojaksoja.</p>
          )}
        </div>
      </div>
      <div className="opening-periods-section">
        <OpeningPeriodsHeader
          title="Poikkeusaukiolojaksot"
          count={exceptionPeriods.length}
          theme={PeriodHeaderTheme.LIGHT}
        />
        <div className="opening-periods-list">
          {exceptionPeriods.length > 0 ? (
            exceptionPeriods.map((datePeriod: DatePeriod) => (
              <OpeningPeriod datePeriod={datePeriod} />
            ))
          ) : (
            <p>Ei poikkeusaukiolojaksoja.</p>
          )}
        </div>
      </div>
    </Collapse>
  );
}
