import React from 'react';
import './LoadingIndicator.scss';

export default function LoadingIndicator({
  text,
}: {
  text: string;
}): JSX.Element {
  return (
    <div className="loading-indicator">
      <div className="hds-loading-spinner hds-loading-spinner--small">
        <div />
        <div />
        <div />
      </div>
      <span className="loading-indicator-text">{text}</span>
    </div>
  );
}
