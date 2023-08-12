import React from "react";
import { levelEras } from "@client/features/game";

export const EraSelector = (props: { startEraKey: number; onSelect: (key: number) => void }) => {
  return (
    <div className="page__item era-selector">
      <label className="era-selector__label">Choose a starting era</label>
      <fieldset className="era-selector__buttons">
        {levelEras.map((levelEra, key) => (
          <button className={`era-selector__button${props.startEraKey === key ? " op--selected" : ""}`} key={key} onClick={() => props.onSelect(key)}>
            <span>{levelEra.labelEra}</span>
          </button>
        ))}
      </fieldset>
    </div>
  );
};
