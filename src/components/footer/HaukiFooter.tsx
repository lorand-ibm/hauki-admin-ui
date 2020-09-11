import React from "react";
import {Koros} from "hds-react";
import "./HaukiFooter.css";

function HaukiFooter(): React.ReactElement<any> {
  // TODO: HAUKI-97 apply HDS Footer component once it is ready
  return (
    <footer className="page-footer">
      <Koros type={"basic"} className="hauki-koros"/>
    </footer>
  )
}

export default HaukiFooter