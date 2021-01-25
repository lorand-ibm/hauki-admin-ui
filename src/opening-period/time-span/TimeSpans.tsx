import React, { useEffect } from 'react';
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
    keyName: 'timeSpanUiId',
    name: timeSpanNamePrefix,
  });

  // If new group is appended we need to trigger nested array append manually, React-hook-form useArrayFields has their own independent scope: https://github.com/react-hook-form/react-hook-form/issues/1561#issuecomment-623398286
  useEffect(() => {
    if (fields.length === 0) {
      append({});
    }
  }, [append, fields]);

  return (
    <>
      <div className="form-group time-spans-group">
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
                key={`time-span-item-${item.timeSpanUiId}`}>
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
