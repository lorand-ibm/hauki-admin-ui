import React from 'react';
import { ArrayField, Control, useFieldArray } from 'react-hook-form';
import { SecondaryButton } from '../../components/button/Button';
import { TimeSpanFormFormat, UiFieldConfig } from '../../common/lib/types';
import TimeSpan from './TimeSpan';

export default function TimeSpans({
  namePrefix,
  control,
  resourceStateConfig,
  register,
}: {
  namePrefix: string;
  control: Control<Record<string, any>>;
  resourceStateConfig: UiFieldConfig;
  register: Function;
}): JSX.Element {
  const timeSpanNamePrefix = `${namePrefix}.timeSpans`;

  const { fields, remove, append } = useFieldArray({
    control,
    keyName: 'timeSpansUiId',
    name: timeSpanNamePrefix,
  });

  return (
    <>
      <h3 className="opening-period-section-title">Aukioloajat</h3>
      <ul
        className="opening-period-field-list form-group"
        data-test="time-span-list">
        {fields.map(
          (
            item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>,
            index: number
          ) => (
            <li
              className="opening-period-field-list-item"
              key={`time-span-${item.id || index}`}>
              <TimeSpan
                namePrefix={`${timeSpanNamePrefix}[${index}]`}
                item={item}
                resourceStateConfig={resourceStateConfig}
                control={control}
                register={register}
                index={index}
                remove={remove}
              />
            </li>
          )
        )}
      </ul>
      <div className="form-group">
        <SecondaryButton
          dataTest="add-new-time-span-button"
          onClick={(): void => append({})}>
          + Lisää aukioloaika
        </SecondaryButton>
      </div>
    </>
  );
}
