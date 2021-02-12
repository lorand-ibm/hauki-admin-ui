import React from 'react';
import './TimeInput.scss';

type TimeInputProps = {
  id: string;
  defaultValue: string;
  ariaLabel?: string;
  dataTest?: string;
  name: string;
  placeholder: string;
  registerFn: (instance: HTMLInputElement | null) => void;
  error?: string;
  wrapperClassName?: string;
  disabled?: boolean;
};
export default function TimeInput({
  id,
  defaultValue,
  ariaLabel,
  dataTest,
  name,
  placeholder,
  registerFn,
  error,
  wrapperClassName,
  disabled = false,
}: TimeInputProps): JSX.Element {
  return (
    <div
      className={`custom-time-input-wrapper hds-text-input hds-text-input__input-wrapper ${
        wrapperClassName || ''
      } ${error ? 'hds-text-input--invalid' : ''}`}>
      <input
        aria-label={ariaLabel}
        data-test={dataTest}
        ref={registerFn}
        id={id}
        type="time"
        pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
        name={name}
        placeholder={placeholder}
        defaultValue={`${defaultValue || ''}`}
        className="custom-time-input hds-text-input__input"
        disabled={disabled}
      />
    </div>
  );
}
