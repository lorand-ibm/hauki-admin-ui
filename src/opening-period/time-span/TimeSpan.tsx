import React, { useEffect } from 'react';
import { Button as HDSButton, IconTrash, Select, TextInput } from 'hds-react';
import Weekdays from './Weekdays';
import './TimeSpan.scss';
import TimeInput from './TimeInput';
import { ResourceStateOption } from '../../common/lib/types';

export default function TimeSpan({
  index,
  remove,
  register,
  setValue,
  resourceStateOptions,
}: {
  index: number;
  remove: Function;
  register: Function;
  setValue: Function;
  resourceStateOptions: ResourceStateOption[];
}): JSX.Element {
  useEffect(() => {
    register({ name: `timeSpans[${index}].resourceState` });
  });

  if (!resourceStateOptions) {
    throw new Error('This should never happen but typescript');
  }

  return (
    <div data-test={`time-span-${index}`} className="time-span-container">
      <div className="time-span-first-header-row">
        <Weekdays index={index} register={register} />
        <HDSButton
          data-test={`remove-time-span-button-${index}`}
          className="remove-time-span-button"
          variant="supplementary"
          onClick={(): void => remove(index)}
          iconLeft={<IconTrash />}>
          Poista aukioloaika
        </HDSButton>
      </div>
      <div className="start-and-end-time-container">
        <div className="start-time-container">
          <label htmlFor={`timeSpans[${index}].startTime`}>Kellonaika *</label>
          <TimeInput
            ariaLabel="Aukiolon alkukellonaika"
            dataTest={`time-span-start-time-${index}`}
            register={register}
            required
            value=""
            id={`timeSpans[${index}].startTime`}
            name={`timeSpans[${index}].startTime`}
            placeholder="--.--"
          />
        </div>
        <div className="dash-between-start-and-end-time-container">
          <p>—</p>
        </div>
        <TimeInput
          ariaLabel="Aukiolon loppukellonaika"
          dataTest={`time-span-end-time-${index}`}
          register={register}
          required
          value=""
          id={`timeSpans[${index}].endTime`}
          name={`timeSpans[${index}].endTime`}
          placeholder="--.--"
        />
      </div>
      <div className="time-span-state-container">
        <Select
          id={`time-span-state-id-${index}`}
          onChange={(selection: { label: string; value: string }): void => {
            setValue(`timeSpans[${index}].resourceState`, selection.value);
          }}
          className="time-span-state"
          options={resourceStateOptions}
          label="Tyyppi"
          placeholder="Valitse tyyppi"
        />
      </div>
      <div className="time-span-description-container">
        <TextInput
          ref={register()}
          id={`timeSpans[${index}].description`}
          name={`timeSpans[${index}].description`}
          className="time-span-description"
          label="Kuvaus"
          placeholder="Valinnainen lyhyt kuvaus esim. naisten vuoro"
        />
      </div>
    </div>
  );
}
