import React from 'react';
import './Weekdays.scss';

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
      <label
        data-test={`weekdays-monday-${index}`}
        htmlFor={`timeSpans[${index}].weekdays[0]`}
        className="day-label">
        <input
          ref={register()}
          type="checkbox"
          name={`timeSpans[${index}].weekdays[0]`}
          className="opening-hours-day-checkbox-input"
          id={`timeSpans[${index}].weekdays[0]`}
        />
        <span className="day-option">Ma</span>
      </label>
      <label
        data-test={`weekdays-tuesday-${index}`}
        htmlFor={`timeSpans[${index}].weekdays[1]`}
        className="day-label">
        <input
          ref={register()}
          type="checkbox"
          name={`timeSpans[${index}].weekdays[1]`}
          className="opening-hours-day-checkbox-input"
          id={`timeSpans[${index}].weekdays[1]`}
        />
        <span className="day-option">Ti</span>
      </label>
      <label
        data-test={`weekdays-wednesday-${index}`}
        htmlFor={`timeSpans[${index}].weekdays[2]`}
        className="day-label">
        <input
          ref={register()}
          type="checkbox"
          name={`timeSpans[${index}].weekdays[2]`}
          className="opening-hours-day-checkbox-input"
          id={`timeSpans[${index}].weekdays[2]`}
        />
        <span className="day-option">Ke</span>
      </label>
      <label
        data-test={`weekdays-thursday-${index}`}
        htmlFor={`timeSpans[${index}].weekdays[3]`}
        className="day-label">
        <input
          ref={register()}
          type="checkbox"
          name={`timeSpans[${index}].weekdays[3]`}
          className="opening-hours-day-checkbox-input"
          id={`timeSpans[${index}].weekdays[3]`}
        />
        <span className="day-option">To</span>
      </label>
      <label
        data-test={`weekdays-friday-${index}`}
        htmlFor={`timeSpans[${index}].weekdays[4]`}
        className="day-label">
        <input
          ref={register()}
          type="checkbox"
          name={`timeSpans[${index}].weekdays[4]`}
          className="opening-hours-day-checkbox-input"
          id={`timeSpans[${index}].weekdays[4]`}
        />
        <span className="day-option">Pe</span>
      </label>
      <label
        data-test={`weekdays-saturday-${index}`}
        htmlFor={`timeSpans[${index}].weekdays[5]`}
        className="day-label">
        <input
          ref={register()}
          type="checkbox"
          name={`timeSpans[${index}].weekdays[5]`}
          className="opening-hours-day-checkbox-input"
          id={`timeSpans[${index}].weekdays[5]`}
        />
        <span className="day-option">La</span>
      </label>
      <label
        data-test={`weekdays-sunday-${index}`}
        htmlFor={`timeSpans[${index}].weekdays[6]`}
        className="day-label">
        <input
          ref={register()}
          type="checkbox"
          name={`timeSpans[${index}].weekdays[6]`}
          className="opening-hours-day-checkbox-input"
          id={`timeSpans[${index}].weekdays[6]`}
        />
        <span className="day-option">Su</span>
      </label>
    </fieldset>
  );
}
