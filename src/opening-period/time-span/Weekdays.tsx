import React from 'react';
import './Weekdays.scss';

const DayCheckbox = ({
  register,
  dataTest,
  timeSpanIndex,
  dayIndex,
  children,
}: {
  register: Function;
  dataTest: string;
  timeSpanIndex: number;
  dayIndex: number;
  children: string;
}) => {
  return (
    <label
      data-test={dataTest}
      htmlFor={`timeSpans[${timeSpanIndex}].weekdays[${dayIndex}]`}
      className="day-label">
      <input
        ref={register()}
        type="checkbox"
        name={`timeSpans[${timeSpanIndex}].weekdays[${dayIndex}]`}
        id={`timeSpans[${timeSpanIndex}].weekdays[${dayIndex}]`}
      />
      <span className="day-option">{children}</span>
    </label>
  );
};

export default function Weekdays({
  index,
  register,
}: {
  index: number;
  register: Function;
}): JSX.Element {
  return (
    <fieldset>
      <legend>Päivät *</legend>
      <DayCheckbox
        register={register}
        dataTest={`weekdays-monday-${index}`}
        timeSpanIndex={index}
        dayIndex={0}>
        Ma
      </DayCheckbox>
      <DayCheckbox
        register={register}
        dataTest={`weekdays-tuesday-${index}`}
        timeSpanIndex={index}
        dayIndex={1}>
        Ti
      </DayCheckbox>
      <DayCheckbox
        register={register}
        dataTest={`weekdays-wednesday-${index}`}
        timeSpanIndex={index}
        dayIndex={2}>
        Ke
      </DayCheckbox>
      <DayCheckbox
        register={register}
        dataTest={`weekdays-thursday-${index}`}
        timeSpanIndex={index}
        dayIndex={3}>
        To
      </DayCheckbox>
      <DayCheckbox
        register={register}
        dataTest={`weekdays-friday-${index}`}
        timeSpanIndex={index}
        dayIndex={4}>
        Pe
      </DayCheckbox>
      <DayCheckbox
        register={register}
        dataTest={`weekdays-saturday-${index}`}
        timeSpanIndex={index}
        dayIndex={5}>
        La
      </DayCheckbox>
      <DayCheckbox
        register={register}
        dataTest={`weekdays-sunday-${index}`}
        timeSpanIndex={index}
        dayIndex={6}>
        Su
      </DayCheckbox>
    </fieldset>
  );
}
