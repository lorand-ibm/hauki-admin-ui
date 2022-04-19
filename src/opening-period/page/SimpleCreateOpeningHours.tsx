import { Button, Select, TimeInput } from 'hds-react';
import React, { useEffect, useState } from 'react';
import {
  Resource,
  ResourceState,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import { SecondaryButton } from '../../components/button/Button';
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

const OpeningHoursRangeTimeSpan = ({
  startTime,
  endTime,
}: {
  startTime?: string;
  endTime?: string;
}) => (
  <div className="opening-hours-range--time-span">
    <TimeInput
      id="startDate"
      hoursLabel="tunnit"
      minutesLabel="minuutit"
      value={startTime}
    />
    <div>-</div>
    <TimeInput
      id="startDate"
      hoursLabel="tunnit"
      minutesLabel="minuutit"
      value={endTime}
    />
  </div>
);

type OptionType = { value: string; label: string };

const OpeningHoursRange = ({
  label,
  defaultIOpen = true,
  resourceStates,
  defaultValues,
}: {
  label: string;
  defaultIOpen?: boolean;
  resourceStates: OptionType[];
  defaultValues?: {
    startTime: string;
    endTime: string;
    state: ResourceState;
  };
}): JSX.Element => {
  const [open, setOpen] = useState(defaultIOpen);
  const [state, setState] = useState(
    defaultValues?.state
      ? resourceStates.find(({ value }) => value === defaultValues.state)
      : undefined
  );

  return (
    <>
      <div className="opening-hours-range--label">{label}</div>
      <div className="opening-hours-range--selections">
        <div className="opening-hours-ranges--switch-buttons">
          <SwitchButtons
            labels={{ on: 'Auki', off: 'Kiinni' }}
            onChange={() => setOpen(!open)}
            value={open}
          />
        </div>
        {open && (
          <>
            <OpeningHoursRangeTimeSpan
              startTime={defaultValues?.startTime}
              endTime={defaultValues?.endTime}
            />
            <Select<OptionType>
              label="Tila"
              options={resourceStates}
              className="opening-hours-range-select"
              onChange={setState}
              placeholder="Placeholder"
              value={state}
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

  const defaultWeekendValueValue = {
    startTime: '09:00',
    endTime: '15:00',
    state: ResourceState.OPEN,
  };

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
        <div className="opening-hours-form">
          <div className="separate-weekdays-section">
            <span className="separate-weekdays-section--label">
              Erottele arkipäivät
            </span>

            <SwitchButtons
              labels={{ on: 'Kyllä', off: 'Ei' }}
              onChange={() => setSeparateWeekdays(!separateWeekdays)}
              value={separateWeekdays}
            />
          </div>
          <section className="opening-hours-section">
            {separateWeekdays &&
              [
                'Maanantai',
                'Tiistai',
                'Keskiviikko',
                'Torstai',
                'Perjantai',
              ].map((day) => (
                <OpeningHoursRange
                  label={day}
                  resourceStates={resourceStates}
                  defaultValues={{
                    startTime: '09:00',
                    endTime: '20:00',
                    state: ResourceState.OPEN,
                  }}
                />
              ))}
            {!separateWeekdays && (
              <OpeningHoursRange
                label="Ma-Pe"
                resourceStates={resourceStates}
                defaultValues={{
                  startTime: '09:00',
                  endTime: '20:00',
                  state: ResourceState.OPEN,
                }}
              />
            )}
            <OpeningHoursRange
              label="Lauantai"
              resourceStates={resourceStates}
              defaultIOpen={false}
              defaultValues={defaultWeekendValueValue}
            />
            <OpeningHoursRange
              label="Sunnuntai"
              resourceStates={resourceStates}
              defaultIOpen={false}
              defaultValues={defaultWeekendValueValue}
            />
          </section>
          <div className="opening-hours-form--button">
            <Button>Tallenna</Button>
            <SecondaryButton>Peruuta</SecondaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
