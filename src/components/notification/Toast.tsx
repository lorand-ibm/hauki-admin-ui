import React from 'react';
import { Notification, NotificationType } from 'hds-react';

type NotifcationProps = {
  label: string;
  text: string;
  onClose?: () => void;
};

const Toast = ({
  label,
  text,
  onClose,
  type,
}: NotifcationProps & { type: NotificationType }): JSX.Element => (
  <Notification
    position="top-right"
    autoClose
    size="small"
    label={label}
    type={type}
    onClose={onClose}>
    {text}
  </Notification>
);

export const SuccessToast = ({
  label,
  text,
  onClose,
}: NotifcationProps): JSX.Element => (
  <Toast label={label} text={text} onClose={onClose} type="success" />
);

export const ErrorToast = ({
  label,
  text,
  onClose,
}: NotifcationProps): JSX.Element => (
  <Toast label={label} text={text} onClose={onClose} type="error" />
);
