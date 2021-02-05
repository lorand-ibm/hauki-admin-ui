import React, { useEffect } from 'react';
import { ArrayField, Control, useFieldArray } from 'react-hook-form';
import { IconClockPlus } from 'hds-react';
import { SecondaryButton } from '../../components/button/Button';
import {
  TimeSpanFormFormat,
  UiOptionsFieldConfig,
} from '../../common/lib/types';
import TimeSpan from './TimeSpan';

export default function TimeSpans({
  groupIndex,
  groupId,
  namePrefix,
  control,
  resourceStateConfig,
  register,
}: {
  groupIndex: number;
  groupId?: string;
  namePrefix: string;
  control: Control;
  resourceStateConfig: UiOptionsFieldConfig;
  register: Function;
}): JSX.Element {
  const initTimeSpan: Partial<TimeSpanFormFormat> = { group: groupId ?? '' };

  const timeSpanNamePrefix = `${namePrefix}[${groupIndex}].timeSpans`;

  const { fields, remove, append } = useFieldArray({
    control,
    keyName: 'timeSpanUiId',
    name: timeSpanNamePrefix,
  });

  // If new group is appended we need to trigger nested array append manually, React-hook-form useArrayFields has their own independent scope: https://github.com/react-hook-form/react-hook-form/issues/1561#issuecomment-623398286
  useEffect(() => {
    if (fields.length === 0) {
      append(initTimeSpan);
    }
  }, [append, fields, initTimeSpan]);

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
          onClick={(): void => append(initTimeSpan)}
          iconLeft={<IconClockPlus />}>
          Lisää aukioloaika
        </SecondaryButton>
      </div>
    </>
  );
}
