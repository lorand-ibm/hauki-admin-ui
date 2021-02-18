import React from 'react';
import { IconAlertCircle } from 'hds-react';
import './IconText.scss';

export function ErrorText({ message }: { message: string }): JSX.Element {
  return (
    <div className="hds-text-input__helper-text custom-icon-text">
      <span className="text-danger">
        <IconAlertCircle />
      </span>
      <span className="text-danger">{message}</span>
    </div>
  );
}

export function NotificationText({
  message,
}: {
  message: string;
}): JSX.Element {
  return (
    <div className="hds-text-input__helper-text custom-icon-text">
      <span>
        <IconAlertCircle />
      </span>
      <span>{message}</span>
    </div>
  );
}
