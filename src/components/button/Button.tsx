import { Button as HDSButton, ButtonSize as HDSButtonSize } from 'hds-react';
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
  iconRight?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export function SecondaryButton({
  children,
  dataTest,
  onClick,
  className = '',
  type = 'button',
  iconLeft,
  iconRight,
  light = false,
  size = 'default',
}: ButtonProps & { light?: boolean; size?: HDSButtonSize }): JSX.Element {
  return (
    <HDSButton
      className={`button-common ${
        light ? 'secondary-button-light' : 'secondary-button'
      } ${className}`}
      theme={light ? 'default' : 'coat'}
      size={size}
      data-test={dataTest}
      variant="secondary"
      onClick={onClick}
      type={type}
      iconLeft={iconLeft}
      iconRight={iconRight}>
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
  disabled,
  isLoading,
  loadingText,
}: ButtonProps): JSX.Element {
  return (
    <HDSButton
      data-test={dataTest}
      className={`button-common primary-button ${
        disabled && 'primary-button--is-disabled'
      } ${isLoading && 'primary-button--is-loading'} ${className}`}
      variant="primary"
      onClick={onClick}
      type={type}
      iconLeft={iconLeft}
      disabled={disabled}
      isLoading={isLoading}
      loadingText={loadingText}>
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
