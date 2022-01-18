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
  mainResourceId?: number;
  resources: string[];
  modified?: string;
};

export default function ResourcePeriodsCopyFieldset({
  resourceId,
  resourceName,
  targetResourceData,
  onChange,
}: {
  resourceName: string;
  resourceId: number;
  targetResourceData: TargetResourcesProps | undefined;
  onChange: (value: TargetResourcesProps | undefined) => void;
}): JSX.Element {
  const [isCopyLoading, setIsCopyLoading] = useState<boolean>(false);

  const copyDatePeriods = async (): Promise<void> => {
    setIsCopyLoading(true);

    if (!targetResourceData?.resources) {
      return;
    }

    try {
      await api.copyDatePeriods(resourceId, targetResourceData?.resources);
      toast.success({
        dataTestId: 'period-copy-success',
        label: 'Aukiolotietojen kopiointi onnistui',
        text: 'Voit tarvittaessa kopioida aukiolotiedot uudelleen',
      });
      onChange({
        mainResourceId: targetResourceData?.mainResourceId,
        resources: targetResourceData?.resources,
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
          (targetResourceData?.resources?.length || 0) + 1
        } pistettä. Klikkasit "${resourceName}"n aukiolotietoa. Sinulle on auennut ”${resourceName}”n aukiolotieto muokattavaksi.`}>
        <p>{`Kun olet muokannut ${resourceName}n aukiolotietoa, paina alla olevaa painiketta. Aukiolotieto päivittyy joukkopäivityksessä valitsemissasi toimipisteissä.`}</p>
        <PrimaryButton
          iconLeft={<IconCopy aria-hidden />}
          isLoading={isCopyLoading}
          loadingText="Aukiolotietoja kopioidaan"
          onClick={(): void => {
            copyDatePeriods();
          }}>{`Päivitä aukiolotiedot ${targetResourceData?.resources?.length} muuhun toimipisteeseen. Ikkuna sulkeutuu.`}</PrimaryButton>
        {targetResourceData?.modified && (
          <span className="resource-copy-modified-text">{`Tiedot päivitetty ${formatDate(
            targetResourceData?.modified,
            datetimeFormFormat
          )}`}</span>
        )}
      </Notification>
    </div>
  );
}
