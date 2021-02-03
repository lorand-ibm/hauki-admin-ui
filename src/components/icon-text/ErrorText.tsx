import React from 'react';
import { IconAlertCircle } from 'hds-react';
import './ErrorText.scss';

export default function ({ message }: { message: string }): JSX.Element {
  return (
    <div className="hds-text-input__helper-text error-text">
      <span className="text-danger">
        <IconAlertCircle />
      </span>
      <span className="text-danger">{message}</span>
    </div>
  );
}
