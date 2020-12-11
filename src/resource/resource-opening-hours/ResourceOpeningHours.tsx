import React, { useState } from 'react';
import { IconInfoCircle, Button } from 'hds-react';
import { useHistory } from 'react-router-dom';
import Collapse from '../../components/collapse/Collapse';
import LanguageSelect from '../../components/language-select/LanguageSelect';
import OpeningPeriod from './opening-period/OpeningPeriod';
import './ResourceOpeningHours.scss';
import { DatePeriod, Language } from '../../common/lib/types';

enum PeriodsListTheme {
  DEFAULT = 'DEFAULT',
  LIGHT = 'LIGHT',
}

const OpeningPeriodsList = ({
  id,
  addNewOpeningPeriodButtonDataTest,
  resourceId,
  title,
  datePeriods,
  theme,
  notFoundLabel,
}: {
  id: string;
  addNewOpeningPeriodButtonDataTest?: string;
  resourceId: string;
  title: string;
  datePeriods: DatePeriod[];
  theme: PeriodsListTheme;
  notFoundLabel: string;
}): JSX.Element => {
  const openingPeriodsHeaderClassName =
    theme === PeriodsListTheme.LIGHT
      ? 'opening-periods-header-light'
      : 'opening-periods-header';

  const history = useHistory();
  const [language, setLanguage] = useState(Language.FI);

  return (
    <section className="opening-periods-section">
      <header className={openingPeriodsHeaderClassName}>
        <div className="opening-periods-header-container">
          <h3 className="opening-periods-header-title">{title}</h3>
          <IconInfoCircle
            aria-hidden
            aria-label="Lisätietoja aukiolojaksoista nappi"
            className="opening-periods-header-info"
          />
        </div>
        <div className="opening-periods-header-container opening-periods-header-actions">
          <p className="period-count">{datePeriods.length} jaksoa</p>
          <LanguageSelect
            id={`${id}-language-select`}
            label={`${title}-listan kielivalinta`}
            selectedLanguage={language}
            onSelect={setLanguage}
          />
          <Button
            data-test={addNewOpeningPeriodButtonDataTest}
            size="small"
            className="opening-period-header-button"
            onClick={(): void =>
              history.push(`/resource/${resourceId}/period/new`)
            }
            variant="secondary">
            Lisää uusi +
          </Button>
        </div>
      </header>
      <ul className="opening-periods-list" data-test={id}>
        {datePeriods.length > 0 ? (
          datePeriods.map((datePeriod: DatePeriod) => (
            <li key={datePeriod.id}>
              <OpeningPeriod
                datePeriod={datePeriod}
                resourceId={resourceId}
                language={language}
              />
            </li>
          ))
        ) : (
          <li>
            <OpeningPeriodsNotFound text={notFoundLabel} />
          </li>
        )}
      </ul>
    </section>
  );
};

const OpeningPeriodsNotFound = ({ text }: { text: string }): JSX.Element => (
  <p className="opening-periods-not-found">{text}</p>
);

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
      <OpeningPeriodsList
        id="resource-opening-periods-list"
        addNewOpeningPeriodButtonDataTest="add-new-opening-period-button"
        resourceId={id}
        title="Aukiolojaksot"
        datePeriods={defaultPeriods}
        theme={PeriodsListTheme.DEFAULT}
        notFoundLabel="Ei aukiolojaksoja."
      />
      <OpeningPeriodsList
        id="resource-exception-opening-periods-list"
        resourceId={id}
        title="Poikkeusaukiolojaksot"
        datePeriods={exceptionPeriods}
        theme={PeriodsListTheme.LIGHT}
        notFoundLabel="Ei poikkeusaukiolojaksoja."
      />
    </Collapse>
  );
}
