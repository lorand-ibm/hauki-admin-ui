import { Button, Select, TimeInput } from 'hds-react';
import React, { useEffect, useState } from 'react';
import { Resource, UiDatePeriodConfig } from '../../common/lib/types';
import api from '../../common/utils/api/api';
import './SimpleCreateOpeningHours.scss';

const SwitchButton = ({
  isActive,
  label,
  onChange,
}: {
  isActive: boolean;
  label: string;
  onChange: () => void;
}): JSX.Element => (
  <Button
    className={`switch-buttons-button ${
      isActive ? 'switch-buttons-button--active' : ''
    }`}
    variant="secondary"
    onClick={(): void => onChange()}>
    {label}
  </Button>
);

const SwitchButtons = ({
  labels,
  initialValue,
  onChange,
}: {
  labels: { on: string; off: string };
  initialValue: boolean;
  onChange: (x: boolean) => void;
}): JSX.Element => {
  const [value, setValue] = useState<boolean>(initialValue);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <div className="switch-buttons">
      <SwitchButton
        isActive={value}
        label={labels.on}
        onChange={(): void => setValue(true)}
      />
      <span className="switch-buttons-divider">/</span>
      <SwitchButton
        isActive={!value}
        label={labels.off}
        onChange={(): void => setValue(false)}
      />
    </div>
  );
};

const OpeningHoursRange = ({ label }: { label: string }): JSX.Element => (
  <>
    <div className="opening-hours-range--label">{label}</div>
    <div className="opening-hours-range--selections">
      <SwitchButtons
        labels={{ on: 'Kyllä', off: 'Ei' }}
        initialValue={false}
        onChange={console.log}
      />
      <div className="opening-hours-range--time-span">
        <TimeInput id="startDate" hoursLabel="tunnit" minutesLabel="minuutit" />
        <div>-</div>
        <TimeInput id="startDate" hoursLabel="tunnit" minutesLabel="minuutit" />
      </div>
      <Select
        label="Tila"
        options={[{ label: 'Plutonium' }]}
        placeholder="Placeholder"
        required
      />
    </div>
  </>
);

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
      {resource && datePeriodConfig && (
        <div>
          <div>Erottele arkipäivät</div>
          <section className="opening-hours-section">
            <OpeningHoursRange label="Ma-Pe" />
            <OpeningHoursRange label="Lauantai" />
            <OpeningHoursRange label="Sunnuntai" />
          </section>
          <Button>Tallenna</Button>
        </div>
      )}
    </div>
  );
}
