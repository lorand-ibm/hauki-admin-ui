import React, { useEffect, useState } from 'react';
import { Resource, UiDatePeriodConfig } from '../../common/lib/types';
import api from '../../common/utils/api/api';

import './SimpleCreateOpeningHours.scss';

export default function CreateNewOpeningPeriodPage({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element {
  const [resource, setResource] = useState<Resource>();
  const [datePeriodConfig, setDatePeriodConfig] = useState<
    UiDatePeriodConfig
  >();

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      try {
        const [apiResource, uiDatePeriodOptions] = await Promise.all([
          api.getResource(resourceId),
          api.getDatePeriodFormConfig(),
        ]);
        setResource(apiResource);
        setDatePeriodConfig(uiDatePeriodOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Add date-period - data initialization error:', e);
      }
    };

    fetchData();
  }, [resourceId]);

  return (
    <div>
      <h1 data-test="resource-info" className="resource-info-title">
        {resource?.name?.fi}
      </h1>
      {resource && datePeriodConfig && <div />}
    </div>
  );
}
