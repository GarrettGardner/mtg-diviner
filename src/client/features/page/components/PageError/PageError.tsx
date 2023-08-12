import React from "react";
import { useAppSelector } from "@client/redux";
import { appFacade } from "@client/features/app";
import { Button } from "@client/features/common";
import { Page } from "@client/features/page";

export const PageError = () => {
  const app = useAppSelector(appFacade.selector);

  const handleRefresh = () => {
    document.location.reload();
  };

  return (
    <Page classes="page--error">
      <div className="page--error__content">
        <p className="page__header page__item">Error</p>
        <p className="page--error__text page__item">{app.error}</p>
        <p>
          <Button onClick={handleRefresh} classes="page__item">
            Refresh
          </Button>
        </p>
      </div>
    </Page>
  );
};
