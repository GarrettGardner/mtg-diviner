import React from "react";
import { IIconButtonProps } from "@client/features/common/models";

export const IconButton = (props: IIconButtonProps) => {
  return (
    <button onClick={props.onClick} className={`icon-button ${props.classes}`}>
      {props.children}
    </button>
  );
};
