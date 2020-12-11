import React, { ReactNode, RefObject, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IconAlertCircle, IconCross } from 'hds-react';
import { PrimaryButton, SecondaryButton } from '../button/Button';
import './ConfirmationModal.scss';

const ModalWrapper = ({
  id,
  ariaLabelledBy,
  children,
}: {
  id: string;
  ariaLabelledBy: string;
  children: ReactNode;
}): JSX.Element => (
  <div
    role="alertdialog"
    id={id}
    className="modal-wrapper"
    aria-labelledby={ariaLabelledBy}
    aria-modal="true">
    {children}
  </div>
);

type UseModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
};

export const useModal = (): UseModalProps => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleModal = (): void => setIsModalOpen(!isModalOpen);
  return {
    isModalOpen,
    toggleModal,
  };
};

export function ConfirmationModal({
  title,
  text,
  confirmText,
  onConfirm,
  isOpen,
  close,
}: {
  title: string;
  text: string | ReactNode;
  confirmText: string;
  onConfirm: () => void;
  isOpen: boolean;
  close: () => void;
}): JSX.Element | null {
  const titleId = 'confirmation-modal-title';
  const buttonRef: RefObject<HTMLButtonElement> = React.createRef();

  const onClose = (): void => {
    close();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-visible');
      document.addEventListener('keydown', onKeyDown, false);
      if (buttonRef.current) buttonRef.current.focus();
    }

    return (): void => {
      document.removeEventListener('keydown', onKeyDown, false);
      document.body.classList.remove('modal-visible');
    };
  });

  const Modal = (): JSX.Element => (
    <>
      <div className="modal-backdrop" />
      <ModalWrapper id="confirmation-modal" ariaLabelledBy={titleId}>
        <div className="modal">
          <div className="modal-header">
            <IconAlertCircle size="s" />
            <h2
              id={titleId}
              className="modal-title text-bold text-md"
              data-test="modalTitle">
              {title}
            </h2>
            <button
              ref={buttonRef}
              className="modal-close button-icon"
              type="button"
              onClick={(): void => close()}
              aria-label="Sulje ikkuna">
              <IconCross size="m" />
            </button>
          </div>
          <div className="modal-content">{text}</div>
          <div className="modal-actions confirm-modal-actions">
            <PrimaryButton
              onClick={(): void => onConfirm()}
              dataTest="modalConfirmButton">
              {confirmText}
            </PrimaryButton>
            <SecondaryButton onClick={(): void => onClose()}>
              Peruuta
            </SecondaryButton>
          </div>
        </div>
      </ModalWrapper>
    </>
  );

  return isOpen ? ReactDOM.createPortal(<Modal />, document.body) : null;
}
