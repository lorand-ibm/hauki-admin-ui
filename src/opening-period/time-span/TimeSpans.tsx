import React from 'react';
import { ArrayField, Control, useFieldArray } from 'react-hook-form';
import { SecondaryButton } from '../../components/button/Button';
import { TimeSpanFormFormat, UiFieldConfig } from '../../common/lib/types';
import TimeSpan from './TimeSpan';

export default function TimeSpans({
  groupIndex,
  namePrefix,
  control,
  resourceStateConfig,
  register,
}: {
  groupIndex: number;
  namePrefix: string;
  control: Control;
  resourceStateConfig: UiFieldConfig;
  register: Function;
}): JSX.Element {
  const timeSpanNamePrefix = `${namePrefix}[${groupIndex}].timeSpans`;

  const { fields, remove, append } = useFieldArray({
    control,
    keyName: 'timeSpansUiId',
    name: timeSpanNamePrefix,
  });

  return (
    <>
      <div className="form-group time-spans-group">
        <h3 className="opening-period-section-title">Aukioloajat</h3>
        <ul
          className="opening-period-field-list"
          data-test={`time-span-list-${groupIndex}`}>
          {fields.map(
            (
              item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>,
              index: number
            ) => (
              <li
                className="opening-period-field-list-item"
                key={`time-span-${item.id || index}`}>
                <TimeSpan
                  namePrefix={timeSpanNamePrefix}
                  item={item}
                  resourceStateConfig={resourceStateConfig}
                  control={control}
                  register={register}
                  index={index}
                  groupIndex={groupIndex}
                  remove={remove}
                />
              </li>
            )
          )}
        </ul>
      </div>
      <div className="form-group">
        <SecondaryButton
          dataTest={`add-new-time-span-button-${groupIndex}`}
          onClick={(): void => append({})}>
          + Lisää aukioloaika
        </SecondaryButton>
      </div>
    </>
  );
}
