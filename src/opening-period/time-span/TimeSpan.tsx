import React from 'react';
import {
  ArrayField,
  Controller,
  DeepMap,
  FieldError,
  useFormContext,
} from 'react-hook-form';
import { Checkbox, IconTrash, TextInput, TimeInput } from 'hds-react';
import { SupplementaryButton } from '../../components/button/Button';
import { ErrorText } from '../../components/icon-text/IconText';
import ResourceStateSelect from '../../components/resourse-state-select/ResourceStateSelect';
import Weekdays from './Weekdays';
import './TimeSpan.scss';
import {
  TimeSpanFormFormat,
  UiFieldConfig,
  ResourceState,
  LanguageStrings,
  Language,
} from '../../common/lib/types';

const descriptionLabelTexts: LanguageStrings = {
  fi: 'Valinnainen kuvaus suomeksi',
  sv: 'Valinnainen kuvaus ruotsiksi',
  en: 'Valinnainen kuvaus englanniksi',
};

const descriptionPlaceholderTexts: LanguageStrings = {
  fi: 'Esim. naisten vuoro',
  sv: 'Esim. för kvinnorna',
  en: 'Esim. for women only',
};

const isEmptyTime = (timeString: string): boolean => {
  const [hours, minutes] = timeString.split(':');
  return !hours && !minutes;
};

const validateTime = (timeString: string): boolean => {
  const [hours, minutes] = timeString.split(':');
  return parseInt(hours, 10) < 24 && parseInt(minutes, 10) < 60;
};

const timeRangeErrorMessage =
  'Aukiololla on oltava vähintään alku tai loppuaika.';

const validateTimeRange = (
  startTime: string,
  endTime: string
): boolean | string => {
  const isValidStartTime = !!startTime && startTime !== ':';
  const isValidEndTime = !!endTime && endTime !== ':';
  return isValidStartTime || isValidEndTime;
};

export default function TimeSpan({
  item,
  namePrefix,
  index,
  groupIndex,
  remove,
  resourceStateConfig,
  errors,
}: {
  item: Partial<ArrayField<TimeSpanFormFormat, 'timeSpanUiId'>>;
  namePrefix: string;
  index: number;
  groupIndex: number;
  remove: Function;
  resourceStateConfig: UiFieldConfig;
  errors: (DeepMap<TimeSpanFormFormat, FieldError> | undefined)[] | undefined;
}): JSX.Element {
  const { control, register, getValues, watch } = useFormContext();
  const timeSpanNamePrefix = `${namePrefix}[${index}]`;
  const { options: resourceStateOptions } = resourceStateConfig;
  const timeSpanErrors = errors && errors[index];
  const fullDayFieldKey = `${timeSpanNamePrefix}.fullDay`;
  const fullDay: boolean = watch(fullDayFieldKey);

  const getDescriptionValueByLanguage = (language: Language): string => {
    const description = item.description
      ? ((item.description as unknown) as LanguageStrings)[language]
      : null;
    return description || '';
  };

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
        defaultValue={item.group}
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
              id={`time-span-${groupIndex}-${index}-start-time`}
              name={`${timeSpanNamePrefix}.startTime`}
              label="Aukiolon alkukellonaika"
              hideLabel
              hoursLabel="tunnit"
              minutesLabel="minuutit"
              data-test={`time-span-start-time-${groupIndex}-${index}`}
              defaultValue={item.startTime || ''}
              ref={register({
                validate: {
                  timeFormat: (startTime: string): boolean | string =>
                    isEmptyTime(startTime) ||
                    validateTime(startTime) ||
                    'Alkuaika on virheellisessä muodossa',
                  timeRange: (startTime: string): boolean | string => {
                    if (fullDay) {
                      return true;
                    }

                    const isValid = validateTimeRange(
                      startTime,
                      getValues(`${timeSpanNamePrefix}.endTime`)
                    );

                    return isValid || timeRangeErrorMessage;
                  },
                },
              })}
              disabled={fullDay}
              invalid={!!timeSpanErrors?.startTime?.message}
              placeholder="--.--"
            />
          </div>
          <div className="dash-between-start-and-end-time-container">
            <p>—</p>
          </div>
          <TimeInput
            id={`time-span-${groupIndex}-${index}-end-time`}
            name={`${timeSpanNamePrefix}.endTime`}
            label="Aukiolon loppukellonaika"
            hideLabel
            hoursLabel="tunnit"
            minutesLabel="minuutit"
            className="time-span-end-time-input"
            data-test={`time-span-end-time-${groupIndex}-${index}`}
            defaultValue={item.endTime || ''}
            ref={register({
              validate: {
                timeFormat: (endTime: string): boolean | string =>
                  isEmptyTime(endTime) ||
                  validateTime(endTime) ||
                  'Loppuaika on virheellisessä muodossa',
                timeRange: (endTime: string): boolean | string => {
                  if (fullDay) {
                    return true;
                  }

                  const isValid = validateTimeRange(
                    getValues(`${timeSpanNamePrefix}.startTime`),
                    endTime
                  );

                  return isValid || timeRangeErrorMessage;
                },
              },
            })}
            invalid={!!timeSpanErrors?.endTime?.message}
            disabled={fullDay}
            placeholder="--.--"
          />
          <div className="time-span-fullday-checkbox-container">
            <Controller
              render={(field): JSX.Element => (
                <Checkbox
                  id={fullDayFieldKey}
                  label="Vuorokausi"
                  name={fullDayFieldKey}
                  onChange={(e): void => {
                    field.onChange(e.target.checked);
                  }}
                  checked={field.value}
                />
              )}
              control={control}
              name={`${timeSpanNamePrefix}.fullDay`}
              defaultValue={item.fullDay || false}
            />
          </div>
        </div>
        {timeSpanErrors &&
          (timeSpanErrors?.startTime || timeSpanErrors?.endTime) && (
            <ErrorText
              id="opening-period-time-span-error-text"
              message={
                timeSpanErrors?.startTime?.message ||
                timeSpanErrors?.endTime?.message ||
                ''
              }
            />
          )}
      </div>
      <div className="form-control">
        <ResourceStateSelect
          control={control}
          name={`${timeSpanNamePrefix}.resourceState`}
          value={`${item.resourceState || ResourceState.OPEN}`}
          label="Valitse aukiolon tila"
          id={`time-span-state-id-${groupIndex}-${index}`}
          options={resourceStateOptions}
        />
      </div>
      <div className="form-control">
        <div className="opening-period-text-group">
          {Object.values(Language).map((languageKey: Language) => (
            <TextInput
              key={`time-span-description-${groupIndex}-${index}-${languageKey}`}
              ref={register()}
              id={`time-span-description-${groupIndex}-${index}-${languageKey}`}
              name={`${timeSpanNamePrefix}.description[${languageKey}]`}
              defaultValue={getDescriptionValueByLanguage(languageKey)}
              label={descriptionLabelTexts[languageKey]}
              placeholder={descriptionPlaceholderTexts[languageKey] || ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
