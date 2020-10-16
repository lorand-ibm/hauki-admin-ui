import React from 'react';
import { Koros } from 'hds-react';
import './HaukiFooter.scss';

export default function HaukiFooter(): JSX.Element {
  // TODO: HAUKI-97 apply HDS Footer component once it is ready
  return (
    <>
      <div className="footer-top-padding" />
      <footer className="page-footer">
        <Koros type="basic" className="hauki-koros" />
      </footer>
    </>
  );
}
