import React, { useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IconClockPlus } from 'hds-react';
import { SecondaryButton } from '../../components/button/Button';
import {
  OpeningPeriodFormData,
  TimeSpanFormFormat,
  UiFieldConfig,
} from '../../common/lib/types';
import TimeSpan from './TimeSpan';

export default function TimeSpans({
  groupIndex,
  groupId,
  namePrefix,
  resourceStateConfig,
}: {
  groupIndex: number;
  groupId?: string;
  namePrefix: 'timeSpanGroups';
  resourceStateConfig: UiFieldConfig;
}): JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<OpeningPeriodFormData>();
  const initTimeSpan: Partial<TimeSpanFormFormat> = useMemo(
    () => ({
      group: groupId ?? '',
    }),
    [groupId]
  );
  const timeSpanNamePrefix = `${namePrefix}.${groupIndex}.timeSpans` as const;
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
          {fields.map((item, index: number) => (
            <li
              className="opening-period-field-list-item"
              key={`time-span-item-${item.timeSpanUiId}`}>
              <TimeSpan
                item={item}
                resourceStateConfig={resourceStateConfig}
                index={index}
                groupIndex={groupIndex}
                remove={remove}
                errors={
                  errors.timeSpanGroups
                    ? errors.timeSpanGroups[groupIndex]?.timeSpans
                    : undefined
                }
              />
            </li>
          ))}
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
