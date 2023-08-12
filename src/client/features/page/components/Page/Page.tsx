import React from "react";
import { IPageProps } from "@client/features/page";

export const Page = (props: IPageProps) => {
  return (
    <div className={`page ${props.classes}`}>
      <h1 className="page__logo page__item">
        <span>MTG Diviner</span>
      </h1>
      {props.children}
    </div>
  );
};
