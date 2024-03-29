import React from "react";
import { IButtonProps } from "@client/features/common/models";

export const Button = (props: IButtonProps) => {
  return (
    <button className={`button ${props.classes}`} onClick={props.onClick}>
      <span>
        {props.children}
        {props.countdown && <span className="button__countdown"></span>}
      </span>
    </button>
  );
};
