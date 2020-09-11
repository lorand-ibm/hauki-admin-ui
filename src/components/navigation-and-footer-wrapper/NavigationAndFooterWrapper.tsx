import HaukiNavigation from "../navigation/HaukiNavigation";
import HaukiFooter from "../footer/HaukiFooter";
import React from "react";

interface Props {
  children: React.ReactNode,
}

function NavigationAndFooterWrapper(props: Props): React.ReactElement<any> {
  return (
    <React.Fragment>
      <HaukiNavigation />
        {props.children}
      <HaukiFooter />
    </React.Fragment>
  )
}

export default NavigationAndFooterWrapper