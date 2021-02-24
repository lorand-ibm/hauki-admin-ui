import React, { ReactNode } from 'react';
import { IconAlertCircle } from 'hds-react';
import './IconText.scss';

type IconTextProps = {
  id: string;
  message: string;
  className?: string;
};

const IconTextContainer = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}): JSX.Element => (
  <div
    className={`hds-text-input__helper-text custom-icon-text ${
      className || ''
    }`}>
    {children}
  </div>
);

export function ErrorText({
  id,
  message,
  className,
}: IconTextProps): JSX.Element {
  return (
    <IconTextContainer className={className}>
      <span className="text-danger">
        <IconAlertCircle area-hidden="true" aria-labelledby={id} />
      </span>
      <span id={id} className="text-danger">
        {message}
      </span>
    </IconTextContainer>
  );
}

export function NotificationText({
  id,
  message,
  className,
}: IconTextProps): JSX.Element {
  return (
    <IconTextContainer className={className}>
      <span>
        <IconAlertCircle area-hidden="true" aria-labelledby={id} />
      </span>
      <span id={id}>{message}</span>
    </IconTextContainer>
  );
}
