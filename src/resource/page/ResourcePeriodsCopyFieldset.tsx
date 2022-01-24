import React, { useState } from 'react';
import { Notification, IconCopy } from 'hds-react';
import api from '../../common/utils/api/api';
import {
  formatDate,
  datetimeFormFormat,
} from '../../common/utils/date-time/format';
import { PrimaryButton } from '../../components/button/Button';
import toast from '../../components/notification/Toast';

export type TargetResourcesProps = {
  mainResourceName?: string;
  mainResourceId?: number;
  resources?: string[];
  modified?: string;
};

export default function ResourcePeriodsCopyFieldset({
  mainResourceName,
  mainResourceId,
  resources = [],
  onChange,
  modified,
}: TargetResourcesProps & {
  onChange: (value: TargetResourcesProps | undefined) => void;
}): JSX.Element {
  const [isCopyLoading, setIsCopyLoading] = useState<boolean>(false);

  const copyDatePeriods = async (): Promise<void> => {
    setIsCopyLoading(true);

    if (!mainResourceId || resources.length === 0) {
      return;
    }

    try {
      await api.copyDatePeriods(mainResourceId, resources);
      toast.success({
        dataTestId: 'period-copy-success',
        label: 'Aukiolotietojen kopiointi onnistui',
        text: 'Voit tarvittaessa kopioida aukiolotiedot uudelleen',
      });
      onChange({
        mainResourceName,
        mainResourceId,
        resources,
        modified: new Date().toJSON(),
      });
      setIsCopyLoading(false);
      if (document.referrer !== '') {
        window.close();
      }
    } catch (err) {
      toast.error({
        dataTestId: 'period-copy-error',
        label: 'Aukiolotietojen kopointi epäonnistui',
        text: 'Yritä myöhemmin uudelleen',
      });
      setIsCopyLoading(false);

      // eslint-disable-next-line no-console
      console.error(err); // For debug purposes
    }
  };

  return (
    <div className="resource-copy-date-periods">
      <Notification
        type="alert"
        label={`Olet valinnut joukkopäivityksessä ${
          (resources?.length || 0) + 1
        } pistettä. Klikkasit "${mainResourceName}"n aukiolotietoa. Sinulle on auennut ”${mainResourceName}”n aukiolotieto muokattavaksi.`}>
        <p>{`Kun olet muokannut ${mainResourceName}n aukiolotietoa, paina alla olevaa painiketta. Aukiolotieto päivittyy joukkopäivityksessä valitsemissasi toimipisteissä.`}</p>
        <PrimaryButton
          iconLeft={<IconCopy aria-hidden />}
          isLoading={isCopyLoading}
          loadingText="Aukiolotietoja kopioidaan"
          onClick={(): void => {
            copyDatePeriods();
          }}>{`Päivitä aukiolotiedot ${resources?.length} muuhun toimipisteeseen. Ikkuna sulkeutuu.`}</PrimaryButton>
        {modified && (
          <span className="resource-copy-modified-text">{`Tiedot päivitetty ${formatDate(
            modified,
            datetimeFormFormat
          )}`}</span>
        )}
      </Notification>
    </div>
  );
}
