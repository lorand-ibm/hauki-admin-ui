import React from 'react';
import HaukiNavigation from '../navigation/HaukiNavigation';
import HaukiFooter from '../footer/HaukiFooter';

interface Props {
  children: React.ReactNode;
  renderFooter: boolean;
}

export default function NavigationAndFooterWrapper(props: Props): JSX.Element {
  return (
    <>
      <HaukiNavigation />
      {props.children}
      {props.renderFooter && <HaukiFooter />}
    </>
  );
}
