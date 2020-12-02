import React from 'react';
import { Link } from 'react-router-dom';
import { IconPenLine } from 'hds-react';
import { DatePeriod } from '../../../common/lib/types';
import { formatDateRange } from '../../../common/utils/date-time/format';
import './OpeningPeriod.scss';

export default function OpeningPeriod({
  resourceId,
  datePeriod,
}: {
  resourceId: string;
  datePeriod: DatePeriod;
}): JSX.Element {
  const name = datePeriod.name?.fi;

  return (
    <div className="opening-period">
      <div className="opening-period-row">
        <div className="opening-period-dates">
          <div>
            {formatDateRange({
              startDate: datePeriod.start_date,
              endDate: datePeriod.end_date,
            })}
          </div>
        </div>
        <div className="opening-period-title">
          <h4>{datePeriod.name?.fi}</h4>
          <Link
            className="opening-period-edit-link"
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
