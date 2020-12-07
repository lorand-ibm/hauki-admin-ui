import React from 'react';
import { Link } from 'react-router-dom';
import { IconPenLine } from 'hds-react';
import { DatePeriod, Language } from '../../../common/lib/types';
import { formatDateRange } from '../../../common/utils/date-time/format';
import { getMissingText } from '../../../components/language-select/LanguageSelect';
import './OpeningPeriod.scss';

export default function OpeningPeriod({
  resourceId,
  datePeriod,
  language,
}: {
  resourceId: string;
  datePeriod: DatePeriod;
  language: Language;
}): JSX.Element {
  const name = datePeriod.name[language];

  return (
    <div className="opening-period">
      <div className="opening-period-row">
        <div className="opening-period-dates opening-period-row-column">
          <div>
            {formatDateRange({
              startDate: datePeriod.start_date,
              endDate: datePeriod.end_date,
            })}
          </div>
        </div>
        <div className="opening-period-title opening-period-row-column">
          {name ? (
            <h4>{name}</h4>
          ) : (
            <h4 className="text-danger">
              {getMissingText({ language, label: 'nimi' })}
            </h4>
          )}
        </div>
        <div className="opening-period-actions opening-period-row-column">
          <Link
            className="opening-period-edit-link"
            data-test={`openingPeriodEditLink-${datePeriod.id}`}
            to={`/resource/${resourceId}/period/${datePeriod.id}`}>
            <IconPenLine aria-hidden="true" />
            <span className="sr-only">{`Muokkaa ${
              name || 'nimettömän'
            } aukiolojakson tietoja`}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
