import React from "react";
import { ILevel } from "@client/features/game";

export const LevelDetail = (props: { classes?: string; level: ILevel }) => {
  return (
    <div className={`level-detail${props.classes ? ` ${props.classes}` : ""}`}>
      <div className={`level-detail__icon op--${props.level.icon}`}></div>
      <div className="level-detail__labels">
        <p className="level-detail__label__main">{props.level.labelMain}</p>
        <p className="level-detail__label__sub">{props.level.labelSub}</p>
      </div>
    </div>
  );
};
