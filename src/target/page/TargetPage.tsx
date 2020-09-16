import React from 'react';

export default function TargetPage({ id }: { id: string }): JSX.Element {
  return <div className="target">Kohdesivu {id}</div>;
}
