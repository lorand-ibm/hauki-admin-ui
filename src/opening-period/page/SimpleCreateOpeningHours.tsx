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
  value,
  onChange,
}: {
  labels: { on: string; off: string };
  value: boolean;
  onChange: (x: boolean) => void;
}): JSX.Element => (
  <div className="switch-buttons">
    <SwitchButton
      isActive={value}
      label={labels.on}
      onChange={(): void => onChange(true)}
    />
    <span className="switch-buttons-divider">/</span>
    <SwitchButton
      isActive={!value}
      label={labels.off}
      onChange={(): void => onChange(false)}
    />
  </div>
);

type OptionType = { value: string; label: string };

const OpeningHoursRange = ({
  label,
  defaultIOpen = true,
  resourceStates,
}: {
  label: string;
  defaultIOpen?: boolean;
  resourceStates: OptionType[];
}): JSX.Element => {
  const [open, setOpen] = useState(defaultIOpen);

  return (
    <>
      <div className="opening-hours-range--label">{label}</div>
      <div className="opening-hours-range--selections">
        <SwitchButtons
          labels={{ on: 'Auki', off: 'Kiinni' }}
          onChange={() => setOpen(!open)}
          value={open}
        />
        {open && (
          <>
            <div className="opening-hours-range--time-span">
              <TimeInput
                id="startDate"
                hoursLabel="tunnit"
                minutesLabel="minuutit"
              />
              <div>-</div>
              <TimeInput
                id="startDate"
                hoursLabel="tunnit"
                minutesLabel="minuutit"
              />
            </div>
            <Select<OptionType>
              label="Tila"
              options={resourceStates}
              className="opening-hours-range-select"
              placeholder="Placeholder"
              required
            />
          </>
        )}
      </div>
    </>
  );
};

export default function CreateNewOpeningPeriodPage({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element {
  const [resource, setResource] = useState<Resource>();
  const [datePeriodConfig, setDatePeriodConfig] = useState<
    UiDatePeriodConfig
  >();
  const [separateWeekdays, setSeparateWeekdays] = useState(false);

  const resourceStates = datePeriodConfig
    ? datePeriodConfig.resourceState.options.map((translatedApiChoice) => ({
        value: translatedApiChoice.value,
        label: translatedApiChoice.label.fi as string,
      }))
    : [];

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
          <div className="separate-weekdays-section">
            <span className="separate-weekdays-section--label">
              Erottele arkipäivät
            </span>{' '}
            <SwitchButtons
              labels={{ on: 'Kyllä', off: 'Ei' }}
              onChange={() => setSeparateWeekdays(!separateWeekdays)}
              value={separateWeekdays}
            />
          </div>
          <section className="opening-hours-section">
            <OpeningHoursRange label="Ma-Pe" resourceStates={resourceStates} />
            <OpeningHoursRange
              label="Lauantai"
              resourceStates={resourceStates}
              defaultIOpen={false}
            />
            <OpeningHoursRange
              label="Sunnuntai"
              resourceStates={resourceStates}
              defaultIOpen={false}
            />
          </section>
          <Button>Tallenna</Button>
          {/* <Button>Peruuta</Button> */}
        </div>
      )}
    </div>
  );
}
