import React from 'react';
import { Notification, NotificationType } from 'hds-react';
import ReactDOM from 'react-dom';

type ToastProps = {
  label: string;
  text: string;
  onClose?: () => void;
  dataTestId?: string;
};

const removeContainer = (container: HTMLDivElement): void => {
  setTimeout(() => {
    if (container && container.parentElement) {
      container.parentElement.removeChild(container);
    }
  }, 1000);
};

const renderToast = ({
  type,
  label,
  text,
  onClose,
  dataTestId,
}: ToastProps & { type: NotificationType }): void => {
  const containerDomNode = document.createElement('div');
  document.body.appendChild(containerDomNode);

  ReactDOM.render(
    <Notification
      position="top-right"
      autoClose
      size="small"
      label={label}
      type={type}
      closeButtonLabelText="Piilota ilmoitus"
      onClose={(): void => {
        if (onClose) {
          onClose();
        }
        removeContainer(containerDomNode);
      }}
      {...(dataTestId ? { dataTestId } : {})}>
      {text}
    </Notification>,
    containerDomNode
  );
};

const successToast = ({
  label,
  text,
  dataTestId,
  onClose,
}: {
  label: string;
  text: string;
  dataTestId: string;
  onClose?: () => void;
}): void => renderToast({ type: 'success', label, text, onClose, dataTestId });

const errorToast = ({
  label,
  text,
  dataTestId,
  onClose,
}: {
  label: string;
  text: string;
  dataTestId?: string;
  onClose?: () => void;
}): void => renderToast({ type: 'error', label, text, onClose, dataTestId });

export default {
  success: successToast,
  error: errorToast,
};
