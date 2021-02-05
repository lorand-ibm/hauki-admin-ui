import React from 'react';
import { ArrayField, Controller, Control } from 'react-hook-form';
import { IconTrash, Select, TextInput } from 'hds-react';
import { SupplementaryButton } from '../../components/button/Button';
import Weekdays from './Weekdays';
import './TimeSpan.scss';
import TimeInput from './TimeInput';
import {
  TimeSpanFormFormat,
  InputOption,
  UiFieldConfig,
} from '../../common/lib/types';

export default function TimeSpan({
  item,
  namePrefix,
  index,
  groupIndex,
  remove,
  register,
  control,
  resourceStateConfig,
}: {
  item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>;
  namePrefix: string;
  index: number;
  groupIndex: number;
  remove: Function;
  register: Function;
  control: Control;
  resourceStateConfig: UiFieldConfig;
}): JSX.Element {
  const timeSpanNamePrefix = `${namePrefix}[${index}]`;
  const { options: resourceStateOptions } = resourceStateConfig;

  return (
    <div
      data-test={`time-span-${groupIndex}-${index}`}
      className="time-span-container">
      <input
        type="hidden"
        name={`${timeSpanNamePrefix}.id`}
        defaultValue={item.id}
        ref={register()}
      />
      <input
        type="hidden"
        name={`${timeSpanNamePrefix}.group`}
        defaultValue={`${item.group || ''}`}
        ref={register()}
      />
      <div className="time-span-first-header-row form-control">
        <Weekdays
          namePrefix={timeSpanNamePrefix}
          index={index}
          groupIndex={groupIndex}
          item={item}
          register={register}
        />
        <SupplementaryButton
          dataTest={`remove-time-span-button-${groupIndex}-${index}`}
          onClick={(): void => remove(index)}
          iconLeft={<IconTrash />}>
          Poista
        </SupplementaryButton>
      </div>
      <div className="form-control">
        <div className="start-and-end-time-container">
          <div className="start-time-container">
            <label
              htmlFor={`${timeSpanNamePrefix}.startTime`}
              className="start-time-container-label">
              Kellonaika *
            </label>
            <TimeInput
              ariaLabel="Aukiolon alkukellonaika"
              dataTest={`time-span-start-time-${groupIndex}-${index}`}
              register={register}
              defaultValue={`${item.startTime}`}
              required
              id={`time-span-${groupIndex}-${index}-start-time`}
              name={`${timeSpanNamePrefix}.startTime`}
              placeholder="--.--"
            />
          </div>
          <div className="dash-between-start-and-end-time-container">
            <p>—</p>
          </div>
          <TimeInput
            ariaLabel="Aukiolon loppukellonaika"
            dataTest={`time-span-end-time-${groupIndex}-${index}`}
            register={register}
            defaultValue={`${item.endTime}`}
            required
            id={`time-span-end-time-${groupIndex}-${index}`}
            name={`${timeSpanNamePrefix}.endTime`}
            placeholder="--.--"
          />
        </div>
      </div>
      <div className="form-control">
        <div className="time-span-state-container">
          <Controller
            control={control}
            name={`${timeSpanNamePrefix}.resourceState`}
            defaultValue={`${item.resourceState || ''}`}
            render={({ onChange, value }): JSX.Element => (
              <Select
                id={`time-span-state-id-${groupIndex}-${index}`}
                onChange={(selected: InputOption): void => {
                  onChange(selected.value);
                }}
                className="time-span-state"
                defaultValue={resourceStateOptions.find(
                  (option: InputOption): boolean => option.value === value
                )}
                options={resourceStateOptions}
                label="Tyyppi"
                placeholder="Valitse tyyppi"
              />
            )}
          />
        </div>
      </div>
      <div className="form-control">
        <div className="time-span-description-container">
          <TextInput
            ref={register()}
            id={`time-span-description-${groupIndex}-${index}`}
            name={`${timeSpanNamePrefix}.description`}
            className="time-span-description"
            defaultValue={`${item.description || ''}`}
            label="Kuvaus"
            placeholder="Valinnainen lyhyt kuvaus esim. naisten vuoro"
          />
        </div>
      </div>
    </div>
  );
}
