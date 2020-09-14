import React from 'react';
import { Koros } from 'hds-react';
import './HaukiFooter.css';

export default function HaukiFooter(): JSX.Element {
  // TODO: HAUKI-97 apply HDS Footer component once it is ready
  return (
    <footer className="page-footer">
      <Koros type="basic" className="hauki-koros" />
    </footer>
  );
}
