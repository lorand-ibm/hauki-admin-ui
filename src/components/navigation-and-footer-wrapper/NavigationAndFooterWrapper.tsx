import React from 'react';
import HaukiNavigation from '../navigation/HaukiNavigation';
import HaukiFooter from '../footer/HaukiFooter';

interface Props {
  children: React.ReactNode;
}

export default function NavigationAndFooterWrapper(props: Props): JSX.Element {
  return (
    <>
      <HaukiNavigation />
      {props.children}
      <HaukiFooter />
    </>
  );
}
