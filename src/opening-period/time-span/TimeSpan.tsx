import React, { useState } from 'react';
import {
  ArrayField,
  DeepMap,
  FieldError,
  useFormContext,
} from 'react-hook-form';
import { Checkbox, IconTrash, TextInput } from 'hds-react';
import { SupplementaryButton } from '../../components/button/Button';
import { ErrorText } from '../../components/icon-text/IconText';
import ResourceStateSelect from '../../components/resourse-state-select/ResourceStateSelect';
import Weekdays from './Weekdays';
import './TimeSpan.scss';
import TimeInput from './TimeInput';
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
  const { control, register, getValues } = useFormContext();
  const timeSpanNamePrefix = `${namePrefix}[${index}]`;
  const { options: resourceStateOptions } = resourceStateConfig;
  const timeSpanErrors = errors && errors[index];

  const [fullDay, setFullDay] = useState((item.fullDay as unknown) as boolean);

  const validateTimeRange = (startTime: string, endTime: string): boolean =>
    !!startTime || !!endTime;

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
              ariaLabel="Aukiolon alkukellonaika"
              dataTest={`time-span-start-time-${groupIndex}-${index}`}
              registerFn={(ref): void =>
                register(ref, {
                  validate: (startTime): boolean => {
                    if (fullDay) {
                      return true;
                    }
                    return validateTimeRange(
                      startTime,
                      getValues(`${timeSpanNamePrefix}.endTime`)
                    );
                  },
                })
              }
              defaultValue={item.startTime || ''}
              error={timeSpanErrors?.startTime?.message}
              id={`time-span-${groupIndex}-${index}-start-time`}
              name={`${timeSpanNamePrefix}.startTime`}
              placeholder="--.--"
              disabled={fullDay}
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
                validate: (endTime): boolean => {
                  if (fullDay) {
                    return true;
                  }
                  return validateTimeRange(
                    getValues(`${timeSpanNamePrefix}.startTime`),
                    endTime
                  );
                },
              })
            }
            defaultValue={item.endTime || ''}
            id={`time-span-end-time-${groupIndex}-${index}`}
            name={`${timeSpanNamePrefix}.endTime`}
            placeholder="--.--"
            wrapperClassName="time-span-end-time-input-wrapper"
            disabled={fullDay}
          />
          <div className="checkbox-container">
            <Checkbox
              id={`${timeSpanNamePrefix}.fullDay`}
              label="Koko päivä"
              name={`${timeSpanNamePrefix}.fullDay`}
              onChange={(e): void => setFullDay(e.target.checked)}
              checked={fullDay}
              ref={register()}
            />
          </div>
        </div>
        {timeSpanErrors &&
          (timeSpanErrors?.startTime || timeSpanErrors?.endTime) && (
            <ErrorText
              id="opening-period-time-span-error-text"
              message="Aukiololla on oltava vähintään alku tai loppuaika."
            />
          )}
      </div>
      <div className="form-control">
        <ResourceStateSelect
          control={control}
          name={`${timeSpanNamePrefix}.resourceState`}
          value={`${item.resourceState || ResourceState.OPEN}`}
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
