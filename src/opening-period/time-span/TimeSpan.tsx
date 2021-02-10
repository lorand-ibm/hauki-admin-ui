import React from 'react';
import {
  ArrayField,
  Controller,
  DeepMap,
  FieldError,
  useFormContext,
} from 'react-hook-form';
import { IconTrash, Select, TextInput } from 'hds-react';
import { SupplementaryButton } from '../../components/button/Button';
import ErrorText from '../../components/icon-text/ErrorText';
import Weekdays from './Weekdays';
import './TimeSpan.scss';
import TimeInput from './TimeInput';
import {
  TimeSpanFormFormat,
  InputOption,
  UiFieldConfig,
  ResourceState,
} from '../../common/lib/types';

export default function TimeSpan({
  item,
  namePrefix,
  index,
  groupIndex,
  remove,
  resourceStateConfig,
  errors,
}: {
  item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>;
  namePrefix: string;
  index: number;
  groupIndex: number;
  remove: Function;
  resourceStateConfig: UiFieldConfig;
  errors: (DeepMap<TimeSpanFormFormat, FieldError> | undefined)[] | undefined;
}): JSX.Element {
  const { control, register, getValues } = useFormContext();
  const timeSpanNamePrefix = `${namePrefix}[${index}]`;
  const { options: resourceStateOptions } = resourceStateConfig;
  const timeSpanErrors = errors && errors[index];

  const validateTimeRange = (startTime: string, endTime: string): boolean =>
    !!startTime || !!endTime;

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
              registerFn={(ref): void =>
                register(ref, {
                  validate: (startTime): boolean =>
                    validateTimeRange(
                      startTime,
                      getValues(`${timeSpanNamePrefix}.endTime`)
                    ),
                })
              }
              defaultValue={`${item.startTime}`}
              error={timeSpanErrors?.startTime?.message}
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
            registerFn={(ref): void =>
              register(ref, {
                validate: (endTime): boolean =>
                  validateTimeRange(
                    getValues(`${timeSpanNamePrefix}.startTime`),
                    endTime
                  ),
              })
            }
            defaultValue={`${item.endTime}`}
            id={`time-span-end-time-${groupIndex}-${index}`}
            name={`${timeSpanNamePrefix}.endTime`}
            placeholder="--.--"
          />
        </div>
        {timeSpanErrors &&
          (timeSpanErrors?.startTime || timeSpanErrors?.endTime) && (
            <ErrorText message="Aukiololla on oltava vähintään alku tai loppuaika." />
          )}
      </div>
      <div className="form-control">
        <div className="time-span-state-container">
          <Controller
            control={control}
            name={`${timeSpanNamePrefix}.resourceState`}
            defaultValue={`${item.resourceState || ResourceState.OPEN}`}
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
