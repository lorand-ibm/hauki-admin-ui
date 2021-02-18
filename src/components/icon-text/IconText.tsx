import React from 'react';
import { IconAlertCircle } from 'hds-react';
import './IconText.scss';

type IconTextProps = {
  id: string;
  message: string;
};

export function ErrorText({ message, id }: IconTextProps): JSX.Element {
  return (
    <div className="hds-text-input__helper-text custom-icon-text">
      <span className="text-danger">
        <IconAlertCircle area-hidden="true" aria-labelledby={id} />
      </span>
      <span id={id} className="text-danger">
        {message}
      </span>
    </div>
  );
}

export function NotificationText({ message, id }: IconTextProps): JSX.Element {
  return (
    <div className="hds-text-input__helper-text custom-icon-text">
      <span>
        <IconAlertCircle area-hidden="true" aria-labelledby={id} />
      </span>
      <span id={id}>{message}</span>
    </div>
  );
}
