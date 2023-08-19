import React from "react";
import { extractManaCost } from "@client/utils";
import { useAppSelector } from "@client/redux";
import { appFacade } from "@client/features/app";
import { ICardProps } from "@client/features/common";
import { CARD_STATUS } from "@client/features/game";

export const Card = (props: ICardProps) => {
  const app = useAppSelector(appFacade.selector);

  let cost = extractManaCost(props.card.cost).map((item, index) => <i key={index} className={`ms ms-cost ms-${item}`}></i>);

  const set = <i className={`ss ss-${props.card.set} ss-${props.card.rarity.toLowerCase()}`}></i>;

  return (
    <div className={`card op--status-${props.card.status} op--color-${props.card.color.toLowerCase()} op--position-${props.card.position}`}>
      <div className="card__hint">
        <div className="card__hint__header">
          <div className="card__shade">&nbsp;</div>
          <div className="card__hint__header__name">???</div>
          <div className="card__hint__header__cost">{cost}</div>
        </div>
        <div className="card__hint__art">
          <div className="card__hint__art__img" style={{ backgroundImage: `url("${props.card.image_art}")` }}>
            <img src={props.card.image_art} />
          </div>
        </div>
        <div className="card__hint__typeline">
          <div className="card__shade">&nbsp;</div>
          <div className="card__hint__typeline__type">{props.card.type}</div>
          <div className="card__hint__typeline__set">{set}</div>
        </div>
      </div>
      {app.debugMode && (
        <button className="card__name" onClick={() => props.onCheatGuess(props.card.name)}>
          {props.card.name}
        </button>
      )}
      <div className="card__timer"></div>
      <div className="card__fullimage" style={{ backgroundImage: `url("${props.card.image_full}")` }}>
        <img src={props.card.image_full} />
      </div>
      {props.card.status === CARD_STATUS.SOLVED && (
        <div className="card__solver">
          <p className="card__solver__points">+1 Point</p>
          {props.card.solvers.map((solver, key) => (
            <p key={key} className="card__solver__username">
              {solver}
            </p>
          ))}
        </div>
      )}
      {props.card.status === CARD_STATUS.EXPIRED && <div className="card__expired">Missed!</div>}
    </div>
  );
};
