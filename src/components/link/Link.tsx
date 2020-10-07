import React from 'react';
import './Link.scss';

export default function Link({
  href,
  text,
  external,
}: {
  href: string;
  text: string;
  external: boolean;
}): JSX.Element {
  return (
    <a
      href={href}
      className="custom-link"
      {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>
      {text}
    </a>
  );
}
