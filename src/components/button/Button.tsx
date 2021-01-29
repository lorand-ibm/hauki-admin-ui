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
  iconLeft?: ReactNode;
}

export function SecondaryButton({
  children,
  dataTest,
  onClick,
  className = '',
  type = 'button',
  iconLeft,
}: ButtonProps): JSX.Element {
  return (
    <HDSButton
      data-test={dataTest}
      className={`button-common secondary-button ${className}`}
      variant="secondary"
      onClick={onClick}
      type={type}
      iconLeft={iconLeft}>
      {children}
    </HDSButton>
  );
}

export function PrimaryButton({
  children,
  dataTest,
  onClick,
  className = '',
  type = 'button',
  iconLeft,
}: ButtonProps): JSX.Element {
  return (
    <HDSButton
      data-test={dataTest}
      className={`button-common primary-button ${className}`}
      variant="primary"
      onClick={onClick}
      type={type}
      iconLeft={iconLeft}>
      {children}
    </HDSButton>
  );
}

export function SupplementaryButton({
  children,
  dataTest,
  onClick,
  className = '',
  type = 'button',
  iconLeft,
}: ButtonProps): JSX.Element {
  return (
    <HDSButton
      type={type}
      data-test={dataTest}
      className={`button-common supplementary-button ${className}`}
      variant="supplementary"
      onClick={onClick}
      iconLeft={iconLeft}>
      {children}
    </HDSButton>
  );
}
