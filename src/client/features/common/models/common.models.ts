import { ICard, ILeaderboardPlayer } from "@client/features/game";

export interface IButtonProps {
  children?: React.ReactNode;
  classes?: string;
  countdown?: boolean;
  onClick: () => void;
}

export interface ICardProps {
  card: ICard;
  onCheatGuess: (guess: string) => void;
}

export interface IIconButtonProps extends IButtonProps {}

export interface IGuessInputProps {
  handleGuess: (guess: string) => void;
}

export interface IGuessInputFormElement extends HTMLFormElement {
  guess: HTMLInputElement;
}

export interface ILeaderboardPlayerProps {
  player: ILeaderboardPlayer;
  rank: number;
}

export interface ILeaderboardProps {
  players: ILeaderboardPlayer[];
  layout: string;
}
