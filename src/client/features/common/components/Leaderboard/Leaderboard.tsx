import React from "react";
import { ILeaderboardPlayer } from "@client/features/game";
import { ILeaderboardProps, LeaderboardPlayer } from "@client/features/common";

export const Leaderboard = (props: ILeaderboardProps) => {
  let players = props.players;

  if (props.layout === "small") {
    players = players.slice(0, 5);
  } else {
    players = players.slice(0, 10);
  }

  return (
    <div className={`page__item leaderboard op--${props.layout}`}>
      <div className="leaderboard__header">Leaderboard</div>
      {players.map((player: ILeaderboardPlayer, index: number) => (
        <LeaderboardPlayer key={player.username} player={player} rank={index + 1} />
      ))}
    </div>
  );
};
