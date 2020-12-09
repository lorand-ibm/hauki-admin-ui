import React, { useState } from 'react';
import './TimeInput.scss';

type TimeInputProps = {
  id: string;
  ariaLabel?: string;
  dataTest?: string;
  value: string;
  name: string;
  placeholder: string;
  register: Function;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
};
export default function TimeInput({
  id,
  ariaLabel,
  dataTest,
  value,
  onChange,
  name,
  placeholder,
  register,
  required,
  error,
}: TimeInputProps): JSX.Element {
  const [inputValue, setInputValue] = useState(value);
  return (
    <div
      className={`custom-time-input-wrapper hds-text-input hds-text-input__input-wrapper ${
        error ? 'hds-text-input--invalid' : ''
      }`}>
      <input
        aria-label={ariaLabel}
        data-test={dataTest}
        ref={register({ required })}
        id={id}
        type="time"
        pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e): void => {
          const eventValue = e.target.value;
          setInputValue(eventValue);
          if (onChange) {
            onChange(eventValue);
          }
        }}
        className="custom-time-input hds-text-input__input"
      />
      {error && <div className="hds-text-input__helper-text">error</div>}
    </div>
  );
}
