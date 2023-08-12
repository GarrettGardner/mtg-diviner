import React from "react";
import { ILeaderboardPlayerProps } from "@client/features/common";

export const LeaderboardPlayer = (props: ILeaderboardPlayerProps) => {
  return (
    <div className={`leaderboard__player op--rank-${props.rank}`}>
      <div className="leaderboard__player__name">{props.player.username}</div>
      <div className="leaderboard__player__points">{props.player.points} Points</div>
    </div>
  );
};
