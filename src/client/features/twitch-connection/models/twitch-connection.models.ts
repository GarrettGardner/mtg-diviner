export interface ITwitchConnection {
  avatar?: string;
  connected: boolean;
  loading: boolean;
  username?: string;
}

export const initialTwitchConnection: ITwitchConnection = {
  connected: false,
  loading: false,
};
