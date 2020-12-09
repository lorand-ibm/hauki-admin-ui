import { Button as HDSButton } from 'hds-react';
import React, { ReactNode } from 'react';
import './Button.scss';

type ButtonVariant = 'primary' | 'secondary';
type ButtonTypeVariant = 'button' | 'submit' | 'reset' | undefined;

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  dataTest?: string;
  className?: string;
  type?: ButtonTypeVariant;
}

export default function Button({
  variant = 'primary',
  children,
  dataTest,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps): JSX.Element {
  return (
    <HDSButton
      data-test={dataTest}
      className={`button-common ${
        variant === 'primary' ? 'primary-button' : 'secondary-button'
      } ${className}`}
      variant={variant}
      onClick={onClick}
      type={type}>
      {children}
    </HDSButton>
  );
}
