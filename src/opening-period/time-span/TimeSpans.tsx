import React, { useEffect } from 'react';
import {
  ArrayField,
  DeepMap,
  FieldError,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { IconClockPlus } from 'hds-react';
import { SecondaryButton } from '../../components/button/Button';
import {
  TimeSpanFormFormat,
  TimeSpanGroupFormFormat,
  UiFieldConfig,
} from '../../common/lib/types';
import TimeSpan from './TimeSpan';

export default function TimeSpans({
  groupIndex,
  groupId,
  namePrefix,
  resourceStateConfig,
  errors,
}: {
  groupIndex: number;
  groupId?: string;
  namePrefix: string;
  resourceStateConfig: UiFieldConfig;
  errors:
    | (DeepMap<TimeSpanGroupFormFormat, FieldError> | undefined)[]
    | undefined;
}): JSX.Element {
  const { control } = useFormContext();
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
                  index={index}
                  groupIndex={groupIndex}
                  remove={remove}
                  errors={errors ? errors[groupIndex]?.timeSpans : undefined}
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
