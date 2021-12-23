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
  originId?: number;
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
        originId: targetResourceData?.originId,
        resources: targetResourceData?.resources,
        modified: new Date().toJSON(),
      });
      setIsCopyLoading(false);
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
        label={`JOUKKOPÄIVITYS. Olet muokkaamassa toimipisteen ${resourceName} tietoja.`}>
        <p>{`Kun teet muutoksia sinulla on mahdollisuus kopioida samat
          aukiolotiedot ${targetResourceData?.resources?.length} muuhun toimipisteeseen`}</p>
        <PrimaryButton
          iconLeft={<IconCopy aria-hidden />}
          isLoading={isCopyLoading}
          loadingText="Aukiolotietoja kopioidaan"
          onClick={(): void => {
            copyDatePeriods();
          }}>{`Kopioi aukiolotiedot ${targetResourceData?.resources?.length} muuhun toimipisteeseen`}</PrimaryButton>
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
