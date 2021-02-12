import React from 'react';
import './Weekdays.scss';
import { ArrayField } from 'react-hook-form';
import { TimeSpanFormFormat } from '../../common/lib/types';

const DayCheckbox = ({
  register,
  dataTest,
  namePrefix,
  dayIndex,
  weekdays = [],
  children,
}: {
  register: Function;
  dataTest: string;
  namePrefix: string;
  dayIndex: number;
  weekdays?: boolean[];
  children: string;
}): JSX.Element => {
  const checkBoxId = `${namePrefix}[${dayIndex}]`;

  return (
    <label data-test={dataTest} htmlFor={checkBoxId} className="day-label">
      <input
        ref={register()}
        defaultChecked={weekdays[dayIndex] || false}
        type="checkbox"
        name={checkBoxId}
        id={checkBoxId}
        data-test={`${dataTest}-checkbox`}
      />
      <span className="day-option">{children}</span>
    </label>
  );
};

export default function Weekdays({
  namePrefix,
  index,
  groupIndex,
  register,
  item,
}: {
  namePrefix: string;
  index: number;
  groupIndex: number;
  register: Function;
  item: Partial<ArrayField<TimeSpanFormFormat, 'timeSpanUiId'>>;
}): JSX.Element {
  const weekdaysNamePrefix = `${namePrefix}.weekdays`;

  return (
    <fieldset className="weekdays">
      <legend>Päivät *</legend>
      <DayCheckbox
        weekdays={item.weekdays}
        register={register}
        dataTest={`weekdays-monday-${groupIndex}-${index}`}
        namePrefix={weekdaysNamePrefix}
        dayIndex={0}>
        Ma
      </DayCheckbox>
      <DayCheckbox
        weekdays={item.weekdays}
        register={register}
        dataTest={`weekdays-tuesday-${groupIndex}-${index}`}
        namePrefix={weekdaysNamePrefix}
        dayIndex={1}>
        Ti
      </DayCheckbox>
      <DayCheckbox
        weekdays={item.weekdays}
        register={register}
        dataTest={`weekdays-wednesday-${groupIndex}-${index}`}
        namePrefix={weekdaysNamePrefix}
        dayIndex={2}>
        Ke
      </DayCheckbox>
      <DayCheckbox
        weekdays={item.weekdays}
        register={register}
        dataTest={`weekdays-thursday-${groupIndex}-${index}`}
        namePrefix={weekdaysNamePrefix}
        dayIndex={3}>
        To
      </DayCheckbox>
      <DayCheckbox
        weekdays={item.weekdays}
        register={register}
        dataTest={`weekdays-friday-${groupIndex}-${index}`}
        namePrefix={weekdaysNamePrefix}
        dayIndex={4}>
        Pe
      </DayCheckbox>
      <DayCheckbox
        weekdays={item.weekdays}
        register={register}
        dataTest={`weekdays-saturday-${groupIndex}-${index}`}
        namePrefix={weekdaysNamePrefix}
        dayIndex={5}>
        La
      </DayCheckbox>
      <DayCheckbox
        weekdays={item.weekdays}
        register={register}
        dataTest={`weekdays-sunday-${groupIndex}-${index}`}
        namePrefix={weekdaysNamePrefix}
        dayIndex={6}>
        Su
      </DayCheckbox>
    </fieldset>
  );
}
