import React, { ReactNode, useState } from 'react';
import { Button, IconAngleDown, IconAngleUp } from 'hds-react';
import './Collapse.scss';

interface BaseCollapseProps {
  collapseContentId: string;
  isOpen: boolean;
}

type ToggleFn = () => void;

interface CollapseProps extends BaseCollapseProps {
  title: string;
  children: ReactNode;
}

interface CollapseButtonProps extends BaseCollapseProps {
  toggleOpen: ToggleFn;
  children: ReactNode;
}

const CollapseButton = ({
  collapseContentId,
  isOpen,
  toggleOpen,
  children,
}: CollapseButtonProps): JSX.Element => {
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.keyCode === 13) {
      toggleOpen();
    }
  };

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={collapseContentId}
      className="collapse-button"
      onKeyDown={onKeyDown}
      onClick={(): void => toggleOpen()}>
      {children}
      {isOpen ? (
        <IconAngleUp className="collapse-button-icon" aria-hidden="true" />
      ) : (
        <IconAngleDown className="collapse-button-icon" aria-hidden="true" />
      )}
    </button>
  );
};

export default ({
  collapseContentId,
  title,
  children,
  isOpen,
}: CollapseProps): JSX.Element => {
  const [isOpenState, setOpen] = useState<boolean>(isOpen);

  const toggleOpen = (): void => {
    setOpen(!isOpenState);
  };

  return (
    <div className="collapse">
      <div className="collapse-header">
        <h2>
          <CollapseButton
            collapseContentId={collapseContentId}
            isOpen={isOpenState}
            toggleOpen={toggleOpen}>
            {title}
          </CollapseButton>
        </h2>
      </div>
      <div
        id={collapseContentId}
        className={`collapse-content ${!isOpenState && 'hiddenFromScreen'}`}
        hidden={!isOpenState}>
        {children}
      </div>
    </div>
  );
};
