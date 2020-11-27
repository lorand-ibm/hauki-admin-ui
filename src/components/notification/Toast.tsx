import React from 'react';
import { Notification, NotificationType } from 'hds-react';

type ToastProps = {
  label: string;
  text: string;
  onClose?: () => void;
};

const Toast = ({
  label,
  text,
  onClose,
  type,
}: ToastProps & { type: NotificationType }): JSX.Element => (
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
}: ToastProps): JSX.Element => (
  <Toast label={label} text={text} onClose={onClose} type="success" />
);

export const ErrorToast = ({
  label,
  text,
  onClose,
}: ToastProps): JSX.Element => (
  <Toast label={label} text={text} onClose={onClose} type="error" />
);
