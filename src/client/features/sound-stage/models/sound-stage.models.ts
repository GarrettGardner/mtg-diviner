export interface ISoundStageSound {
  name: string;
  url: string;
}

export interface ISoundStage {
  muted: boolean;
  sound: string;
  sounds: ISoundStageSound[];
  updated: number;
}

export const initialSoundStage: ISoundStage = {
  muted: false,
  sound: "",
  sounds: [
    {
      name: "card-missed",
      url: "../assets/audio/card-missed.mp3",
    },
    {
      name: "card-new",
      url: "../assets/audio/card-new.mp3",
    },
    {
      name: "card-solved",
      url: "../assets/audio/card-solved.mp3",
    },
    {
      name: "round-won",
      url: "../assets/audio/round-won.mp3",
    },
    {
      name: "round-lost",
      url: "../assets/audio/round-lost.mp3",
    },
  ],
  updated: 0,
};
