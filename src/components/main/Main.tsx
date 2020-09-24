import React, { ReactNode } from 'react';
import './Main.scss';

type MainProps = {
  children: ReactNode;
};

export default ({ children }: MainProps): JSX.Element => (
  <main className="main-container">{children}</main>
);
